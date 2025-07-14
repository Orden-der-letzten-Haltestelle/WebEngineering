With this Endpoint, you can test every resource with an userId, if that user has access to it and can perform the action given.

# Endpoint
```
GET /api/auth/hasAccess
```
## Request Body

```json
{
   "userId": "{userId}",
   "resourceId": "{resourceId}",
   "resource": "{resource}",
   "action": "{action}"
}
```

### Resources
* products
* cartItem
* orderItem
* user
* user_has_role
* roles
* wishlist_member
* wishlistItems
* user_wishlist_relation
* wishlistRoles

### Actions
* GET
* POST
* PUT
* DELETE

# Products
## GET
Always true 

## POST 
Requires Admin 

## PUT 
Requires Role Admin and resourceId

## DELETE
Requires Role Admin and resourceId

# Cart Items
## GET
When no resourceId given, true (user access his cart)
When an resourceId given, user needs to be owner of that cartItem

## POST
required resourceId
