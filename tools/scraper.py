import requests
import re
import os
import json
import hashlib
from IPython import embed

## assumes a query to be a flat dit.
def queryToCacheKey(query):
    result = ""
    keys = list(query.keys())
    keys.sort()
    for k in keys:
        result += "{}|{}|".format(k,query[k])
    hash = hashlib.sha256(result.encode("utf-8"))
    return hash.hexdigest()

def cachePathForHash(hash):
    basePath = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(basePath, "cache", "{}.json".format(hash))


def fetchCachedRequest(hash):
    cachePath = cachePathForHash(hash)
    if os.path.exists(cachePath):
        f = open(cachePath, 'r')
        contents = f.read()
        try:
            return json.loads(contents)
        except:
            return None
    else:
        return None

def writeCache(hash, data):
    cachePath = cachePathForHash(hash)
    f = open(cachePath, 'w')
    f.write(json.dumps(data))

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
        except:
            pass
        obj[key.strip()] = val.strip()
    return obj


titles = filterBacklinks(fetchBacklinkPages())
titles.sort()
data = []

##### THIS LIMITS IT TO FIRST 3!
count = 0
for title in titles:
    #if title != 'Lepiota brunneoincarnata':
    #    continue
    print(title)
    try:
        count += 1
        result = fetchPageContent(title)
        content = extractPageContent(result)
        obj = extractBox(content, "mycomorphbox")
        if obj != None:
            data.append(obj)
    except Exception as e:
        print("FAILED FOR {}".format(title))
        print(e)


f = open("fungi.json", "w")
f.write(json.dumps(data))
f.close()
for x in data:
    pass
    #print(json.dumps(x))
print("Found {} pages".format(count))
