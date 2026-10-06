-- 添加取餐码字段到订单表
USE canteen_ordering;

-- 检查字段是否存在，如果不存在则添加
SET @dbname = DATABASE();
SET @tablename = 'orders';
SET @columnname = 'pickup_code';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN pickup_code VARCHAR(10) AFTER status')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 添加订单类型字段
SET @columnname2 = 'order_type';
SET @preparedStatement2 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename)
      AND (column_name = @columnname2)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN order_type VARCHAR(20) DEFAULT "eatIn" AFTER total_price')
));
PREPARE alterIfNotExists2 FROM @preparedStatement2;
EXECUTE alterIfNotExists2;
DEALLOCATE PREPARE alterIfNotExists2;

-- 添加备注字段
SET @columnname3 = 'remark';
SET @preparedStatement3 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename)
      AND (column_name = @columnname3)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN remark TEXT AFTER order_type')
));
PREPARE alterIfNotExists3 FROM @preparedStatement3;
EXECUTE alterIfNotExists3;
DEALLOCATE PREPARE alterIfNotExists3;

-- 为order_items表添加name, specification, spiciness字段
SET @tablename2 = 'order_items';

-- 添加name字段
SET @columnname4 = 'name';
SET @preparedStatement4 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename2)
      AND (column_name = @columnname4)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename2, ' ADD COLUMN name VARCHAR(100) AFTER dish_id')
));
PREPARE alterIfNotExists4 FROM @preparedStatement4;
EXECUTE alterIfNotExists4;
DEALLOCATE PREPARE alterIfNotExists4;

-- 添加specification字段
SET @columnname5 = 'specification';
SET @preparedStatement5 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename2)
      AND (column_name = @columnname5)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename2, ' ADD COLUMN specification VARCHAR(100) AFTER name')
));
PREPARE alterIfNotExists5 FROM @preparedStatement5;
EXECUTE alterIfNotExists5;
DEALLOCATE PREPARE alterIfNotExists5;

-- 添加spiciness字段
SET @columnname6 = 'spiciness';
SET @preparedStatement6 = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename2)
      AND (column_name = @columnname6)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename2, ' ADD COLUMN spiciness VARCHAR(50) AFTER specification')
));
PREPARE alterIfNotExists6 FROM @preparedStatement6;
EXECUTE alterIfNotExists6;
DEALLOCATE PREPARE alterIfNotExists6;

SELECT '数据库表结构更新完成！' AS message;
