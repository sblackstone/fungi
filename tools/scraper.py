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
    blps = apiRequest({
            "action": "query",
            "format": "json",
            "list": "backlinks",
            "blnamespace": "articles",
            "bllimit": 5000,
            "bltitle": "Template:Mycomorphbox"
        })

    return blps["query"]["backlinks"]

def isSkip(str):
        skips = ["Talk", "Wikipedia", "Template", "User"]
        for s in skips:
            if str.startswith(s):
                return True
        return False

def filterBacklinks(backlinks):
    goodPages = []

    for b in backlinks:
        title = b["title"]
        if not isSkip(title):
            goodPages.append(title)
    return goodPages

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

titles = filterBacklinks(fetchBacklinkPages())
data = []

##### THIS LIMITS IT TO FIRST 3!
for title in titles:
    try:
        result = fetchPageContent(title)
        content = extractPageContent(result)
        reg = re.compile("\{\{mycomorphbox[^\}]*", re.MULTILINE)
        rawBox = reg.findall(content)
        if len(rawBox) == 0:
            print("Skipping: {}".format(title))
            continue
        rawBox = rawBox[0]

        rawBox = rawBox.replace("\n", "")
        obj = {}
        lines = rawBox.split("|")
        for i in range(1, len(lines)):
            line = lines[i]
            [key,val] = line.split("=")
            obj[key.strip()] = val.strip()
        obj["name"] = title
        data.append(obj)
    except Exception as e:
        print("FAILED FOR {}".format(title))
        print(e)


f = open("fungi.json", "w")
f.write(json.dumps(data))
f.close()
