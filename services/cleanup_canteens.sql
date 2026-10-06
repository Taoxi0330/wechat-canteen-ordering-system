-- 清理重复的食堂数据
-- 保留id最小的记录，删除其他重复记录

USE canteen_ordering;

-- 删除id大于3的食堂（这些是重复的）
DELETE FROM canteens WHERE id > 3;

-- 查看清理后的结果
SELECT * FROM canteens;
