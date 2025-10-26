-- Table structure for table `eligible_students`
CREATE TABLE `eligible_students` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `cgpa` DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for table `eligible_students`
ALTER TABLE `eligible_students`
  ADD INDEX (`department`),
  ADD INDEX (`cgpa`);
