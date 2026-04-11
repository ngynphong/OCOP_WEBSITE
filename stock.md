Admin - Inventory

GET /admin/inventory
params:
shopId
pageNo
pageSize

response:
{
"code": 0,
"message": "string",
"data": {
"pageNo": 0,
"pageSize": 0,
"totalPage": 0,
"totalElement": 0,
"sortBy": [
"string"
],
"items": [
{
"id": 0,
"variantId": 0,
"variantName": "string",
"sku": "string",
"stockQty": 0,
"reservedQty": 0,
"availableQty": 0,
"soldQty": 0,
"damagedQty": 0,
"lowStockThreshold": 0,
"lowStock": true,
"outOfStock": true,
"lastRestockedAt": "2026-04-10T04:13:11.331Z",
"updatedAt": "2026-04-10T04:13:11.331Z"
}
]
}
}

GET /admin/inventory/alerts/low-stock
params:
pageNo
pageSize

response:
{
"code": 0,
"message": "string",
"data": {
"pageNo": 0,
"pageSize": 0,
"totalPage": 0,
"totalElement": 0,
"sortBy": [
"string"
],
"items": [
{
"id": 0,
"variantId": 0,
"variantName": "string",
"sku": "string",
"stockQty": 0,
"reservedQty": 0,
"availableQty": 0,
"soldQty": 0,
"damagedQty": 0,
"lowStockThreshold": 0,
"lowStock": true,
"outOfStock": true,
"lastRestockedAt": "2026-04-10T04:15:00.027Z",
"updatedAt": "2026-04-10T04:15:00.027Z"
}
]
}
}

POST /admin/inventory/variants/{variantId}/adjust
params:
variantId
body:
{
"delta": 0,
"note": "string"
}
response:
{
"code": 0,
"message": "string",
"data": {
"id": 0,
"variantId": 0,
"variantName": "string",
"sku": "string",
"stockQty": 0,
"reservedQty": 0,
"availableQty": 0,
"soldQty": 0,
"damagedQty": 0,
"lowStockThreshold": 0,
"lowStock": true,
"outOfStock": true,
"lastRestockedAt": "2026-04-10T04:16:49.505Z",
"updatedAt": "2026-04-10T04:16:49.505Z"
}
}
Quản lý nội bộ quản lý tồn kho

POST /internal/inventory/reserve
body:
{
"variantId": 0,
"quantity": 1,
"refType": "ORDER",
"refId": "string"
}
response:
{
"code": 0,
"message": "string",
"data": {
"variantId": 0,
"reservedQty": 0,
"availableQty": 0,
"success": true
}
}

POST /internal/inventory/release
body:
{
"variantId": 0,
"quantity": 1,
"refType": "ORDER",
"refId": "string"
}
response:
{
"code": 0,
"message": "string",
"data": "string"
}

POST /internal/inventory/commit
body:
{
"variantId": 0,
"quantity": 1,
"refType": "ORDER",
"refId": "string"
}
response:
{
"code": 0,
"message": "string",
"data": "string"
}
