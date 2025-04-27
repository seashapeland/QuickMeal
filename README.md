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
