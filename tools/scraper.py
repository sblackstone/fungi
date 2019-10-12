import requests
import re
import os
import json
from IPython import embed

def apiRequest(params):
    s = requests.Session()
    url = "https://en.wikipedia.org/w/api.php"

    r = s.get(url=url, params=params)
    data = r.json()

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
for title in titles[:5]:
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

print(json.dumps(data))
