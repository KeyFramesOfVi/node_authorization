# node_authorization

A Node/Express/MongoDB setup for login/register pages. Created to be simple and easy to setup/customize.

Uses Express in order to set up the server. 

Uses passport.js as authorization middleware. Will be updated to eventually include OAuth verification. 

Uses Mongoose in order to create Schema based documents for the user collection in MongoDB. Can be edited easily
in order to fit users specific MongoDB needs.

Handles verification to make sure emails are valid, passwords are valid, and that duplicate emails cannot be added. Can 
be edited in order to fit the developer's need.

Is setup to support login, register, and logout features, should be easy to apply to front-ends of any kind. Is set up 
with hogan.js as a templating engine but can easily be replaced with HTML/other templates. 
