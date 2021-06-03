import re

def validateDataNewContact(username, email, phone):
    goodUsername = re.match("([a-z0-9]{1,15})", username);
    goodEmail    = re.match("([a-z0-9]{1,15})@((gmail)|(hotmail)|(yahoo)|(outlook))\.com", email)
    goodPhone    = re.match("([0-9]{10})", phone)

    return True if(goodUsername and goodEmail and goodPhone) else False