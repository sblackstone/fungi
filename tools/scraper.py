import requests


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



pages = filterBacklinks(fetchBacklinkPages())

for page in pages:
    print(page)
