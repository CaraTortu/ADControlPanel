# AD Control Panel

This is a web panel for users to manage their data and admins to reset and manage the entire thing

Please note: This is still in development. Teacher functionality and file management will be added in the future

# Instructions

To run
```powershell
npm run dev
```

To build and run the production version
```powershell
npm run build
npm run start
```

# Config

## adUserName

This is the administrator username to be able to add / remove users and change their data

Example: 
```
adUserName = "Admin"
```

## adHost

This is the domain that the DC uses.

Example:
```
adHost = "test.local"
```

## adPasswd

This is the password the admin user configured earlier

Example: 
```
adPasswd = "P4ssw0rd123!"
```

## adURL

This is the url to connect to the LDAP server. We need the ldaps protocol (Ldap over ssl/tls) to be able to set passwords

WARNING: If you set the protocol to ldap, the web will NOT work

Example: 
```
adURL = "ldaps://192.168.1.54"
```

## adBase

This is the path to add the users.

For example, the following structure:

+ test.local
    + Students
        + A
        + B
        + C
        + D
        + E
        + F

Should be configured like:

```
adBase = "OU=Students,DC=test,DC=local"
```

## userDBFile

This is the file where the usernames and their passwords will be added on creation and/or change

Example:

```
userDBFile = "./DB/users.json"
```

## sessionDBFile

This is the file where the sessions will be managed and looked up

Example: 

```
sessionDBFile = "./DB/sess.json"
```
