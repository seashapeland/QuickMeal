管理员表（admin_infos）
    这个表用于存储管理员的基本信息、权限及安全性相关的字段。
| 字段              | 类型          | 说明                                   |
|-------------------|---------------|----------------------------------------|
| admin_id          | INT           | 主键，唯一标识每个管理员               |
| username          | VARCHAR(255)   | 管理员用户名，唯一                     |
| password_hash     | VARCHAR(255)   | 管理员密码的哈希值（密码加密后存储）   |
| role              | VARCHAR(50)    | 管理员角色（super_admin, admin）      |
| status            | BOOLEAN       | 管理员账户是否有效（true表示有效，false表示禁用） |
| last_login_time   | DATETIME      | 上次登录时间                           |
| created_at        | DATETIME      | 管理员账户创建时间                     |


菜品表（dishes）
    这个表用于存储每个菜品的信息，包括名称、描述、图片等。
| 字段              | 类型          | 说明                                   |
|-------------------|---------------|----------------------------------------|
| dish_id           | INT           | 主键，唯一标识每个菜品                 |
| name              | VARCHAR(255)   | 菜品的名称，必须是唯一的               |
| description       | TEXT          | 可选，提供有关菜品的简短介绍或特色    |
| image_url         | VARCHAR(255)   | 菜品的图片相对路径，用于在前端构建完整的URL    |
| price             | DECIMAL(10, 2) | 每个菜品的价格                         |
| category_id       | INT           | 外键，关联菜品类别表，表示菜品所属的类别（如：主食、配菜等） |
| is_available      | BOOLEAN       | 布尔值，标记菜品是否可用（即是否下架） |
| created_at        | DATETIME      | 创建时间，用于记录菜品添加的时间      |
| updated_at        | DATETIME      | 最后一次更新时间，用于记录菜品更新的时间 |


菜品类别表（dish_categories）
    这个表用于存储菜品的类别信息。
| 字段            | 类型         | 说明                               |
|-----------------|--------------|------------------------------------|
| category_id     | INT          | 主键，唯一标识菜品类别             |
| category_name   | VARCHAR(255)  | 菜品类别的名称，如“主食”、“配菜”等 |

菜品评分表（dish_reviews）
    这个表用于存储用户对菜品的评论与评分信息。
| 字段            | 类型         | 说明                               |
|-----------------|--------------|------------------------------------|
| review_id       | INT          | 主键，唯一标识每条评论             |
| dish_id         | INT          | 外键，关联菜品表，表示评论针对哪个菜品 |
| user_id         | INT          | 外键，关联用户表，表示评论来自哪个用户 |
| rating          | INT          | 评分，通常是1-5的评分              |
| review_content  | TEXT         | 评论的详细内容                     |
| created_at      | DATETIME     | 评论的时间                         |

菜品价格历史表（dish_price_history）
    这个表用于存储菜品的价格变化历史。
| 字段            | 类型         | 说明                               |
|-----------------|--------------|------------------------------------|
| price_record_id | INT          | 主键，唯一标识每条价格记录         |
| dish_id         | INT          | 外键，关联菜品表                   |
| original_price  | DECIMAL(10, 2) | 记录该菜品的原价                   |
| current_price   | DECIMAL(10, 2) | 记录该菜品的当前价格               |
| effective_date  | DATETIME     | 记录该价格的生效时间               |
