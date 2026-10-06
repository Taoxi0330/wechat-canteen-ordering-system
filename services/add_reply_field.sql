-- 为reviews表添加商家回复字段
ALTER TABLE reviews 
ADD COLUMN reply TEXT COMMENT '商家回复内容',
ADD COLUMN reply_at TIMESTAMP NULL COMMENT '回复时间';

-- 查看表结构确认字段已添加
DESCRIBE reviews;