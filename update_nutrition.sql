-- 添加营养信息字段到 dishes 表
ALTER TABLE dishes 
ADD COLUMN nutrition JSON NULL COMMENT '营养信息，包含蛋白质、碳水化合物、脂肪、维生素等';
