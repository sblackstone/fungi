import requests
import re
import os
import json
import hashlib
import boto3

s3 = boto3.resource('s3')

BUCKET_NAME = os.environ["S3_BUCKET"]


## assumes a query to be a flat dit.
def queryToCacheKey(query):
    result = ""
    keys = list(query.keys())
    keys.sort()
    for k in keys:
        result += "{}|{}|".format(k,query[k])
    hash = hashlib.sha256(result.encode("utf-8"))
    h = hash.hexdigest()
    return h[:16]

def fetchCachedRequest(hash):
    try:
        contents = s3.get(BUCKET_NAME, hash)
        return json.loads(contents)
    except Exception as e: # TODO: FIXME
        return None

def writeCache(hash, data):
    print("HASH = {}".format(hash))
    object = s3.Object(BUCKET_NAME, hash)
    object.put(Body=json.dumps(data).encode())

def writeFungiJson(data):
    object = s3.Object(BUCKET_NAME, "fungi.json")
    object.put(Body=json.dumps(data).encode())

def apiRequest(params):
    key = queryToCacheKey(params)
    data = fetchCachedRequest(key)
    if data != None:
        return data

    s = requests.Session()
    url = "https://en.wikipedia.org/w/api.php"
    r = s.get(url=url, params=params)
    data = r.json()
    writeCache(key, data)
    return data
    #return data["query"]["backlinks"]

def fetchBacklinkPages():

    query = {
            "action": "query",
            "format": "json",
            "prop": "transcludedin",
            "tilimit": 5000,
            "tinamespace": 0,
            "titles": "Template:Mycomorphbox",
            "ticontinue": 0
    }

    results = []
    while True:
        data = apiRequest(query)

        keys = list(data["query"]["pages"].keys())
        data2 = data["query"]["pages"][keys[0]]["transcludedin"]
        results = results + data2

        if not "continue" in data:
            break

        query["ticontinue"] = data["continue"]["ticontinue"]

    return results


def filterBacklinks(backlinks):
    return [ bl["title"] for bl in backlinks]
#TODO
def fetchPageImages(title):
    images = apiRequest({
            "action": "query",
            "format": "json",
            "prop": "pageimages",
            "titles": title,
            "pithumbsize": 200
    })

    return images

def fetchPageContent(title):
    page = apiRequest({
            "action": "query",
            "format": "json",
            "prop": "revisions",
            "rvprop": "content",
            "redirects": 1,
            "titles": title
    })

    return page


def extractImages(result):
    data = result["query"]["pages"];
    data = list(data.values())[0]
    return(data)


def extractPageContent(result):
    data = result["query"]["pages"]
    data = list(data.values())[0]
    content = data["revisions"][0]['*']
    return content

def extractBox(data, boxName):
    regEx = '{{' + boxName + '[^\}]*'
    reg = re.compile(regEx, re.MULTILINE | re.IGNORECASE)
    rawBox = reg.findall(content)
    if len(rawBox) == 0:
        print("Box not found: {}".format(title))
        return None
    rawBox = rawBox[0]

    rawBox = rawBox.replace("\n", "")
    obj = {}
    lines = rawBox.split("|")
    for i in range(1, len(lines)):
        line = lines[i]
        try:
            [key,val] = line.split("=")
            key = key.strip()
            val = val.strip()
            key = re.sub("[0-9]+$", "", key)
            if key == "name":
                if val.startswith("''"):
                    val = val[2:]
                if val.endswith("''"):
                    val = val[0:-2]

            if val == "":
                continue
            if val == "NA":
                continue
            if val == "unknown":
                continue

            obj[key] = obj.get(key) or []
            obj[key].append(val)

        except Exception as err:
            print(err)
            pass


    return obj


def downloadImage(path, imgUrl):
    if not os.path.exists(path):
        r = requests.get(imgUrl, stream=True)
        if r.status_code == 200:
            with open(path, 'wb') as f:
                for chunk in r:
                    f.write(chunk)
    else:
        print("Skipping {}".format(path))


def importLambda(event, context):
    print("Hello there!")
    print(BUCKET_NAME)
    print(BUCKET_NAME)
    print(BUCKET_NAME)
    print(BUCKET_NAME)

    titles = filterBacklinks(fetchBacklinkPages())
    titles.sort()

    data = []

    ##### THIS LIMITS IT TO FIRST 3!
    count = 0
    for title in titles[:3]:
        #if title != 'Lepiota brunneoincarnata':
        #    continue
        # print(title)
        try:
            count += 1
            result = fetchPageContent(title)
            images = fetchPageImages(title)

            content = extractPageContent(result)
            images = extractImages(images)
            obj = extractBox(content, "mycomorphbox")
            #obj2 = extractBox(content, "Speciesbox")

            if obj != None:
                obj["id"] = count
                obj["wikiUrl"] = 'https://en.wikipedia.org/wiki/{}'.format(title.replace(' ', '_'))

                if "thumbnail" in images:
                    hash = hashlib.sha256(title.encode("utf-8"))
                    filename = '../public/images/{}'.format(hash.hexdigest())

                    downloadImage(filename, images["thumbnail"]["source"])
                    obj["image"] = '/images/{}'.format(hash.hexdigest())

                #if obj2 != None and "image" in obj2:
                #    obj["image"] = obj2["image"]
                data.append(obj)

        except Exception as e:
            print("FAILED FOR {}".format(title))
            print(e)


    allkeys = {}

    for row in data:
        print(json.dumps(row))
        for k in list(row.keys()):
            if k != "name" and k != "id" and k != "image" and k != "wikiUrl":
                allkeys[k] = allkeys.get(k) or {}
                for x in row[k]:
                    allkeys[k][x] = True

    tmp = list(allkeys.keys())


    for x in tmp:
        allkeys[x] = list(allkeys[x].keys())

    meta = {
      "attributes": allkeys
    }

    result = {
      "fungi": data,
      "meta": meta
    }

    writeFungiJson(result)

    print("Found {} pages".format(count))
