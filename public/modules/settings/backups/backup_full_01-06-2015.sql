-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema ULib
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ULib` ;

-- -----------------------------------------------------
-- Schema ULib
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ULib` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `ULib` ;

-- -----------------------------------------------------
-- Table `ULib`.`Languages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Languages` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Languages` (
  `language_id` INT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL DEFAULT '',
  `description` VARCHAR(250) NULL DEFAULT '',
  PRIMARY KEY (`language_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `ULib`.`Groups`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Groups` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Groups` (
  `group_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `description` VARCHAR(250) NULL,
  PRIMARY KEY (`group_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`Staffs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Staffs` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Staffs` (
  `staff_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(32) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `name` VARCHAR(45) NULL,
  `phone_number` VARCHAR(12) NULL,
  `group_id` INT NULL DEFAULT 0,
  `gender` VARCHAR(5) NULL DEFAULT 1,
  `birthday` DATE NULL,
  PRIMARY KEY (`staff_id`, `group_id`),
  INDEX `fk_Staff_group_idx` (`group_id` ASC),
  CONSTRAINT `fk_Staff_group`
    FOREIGN KEY (`group_id`)
    REFERENCES `ULib`.`Groups` (`group_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`StaffRoles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`StaffRoles` ;

CREATE TABLE IF NOT EXISTS `ULib`.`StaffRoles` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NULL,
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`Permissions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Permissions` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Permissions` (
  `group_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  INDEX `fk_Permissions_2_idx` (`role_id` ASC),
  INDEX `fk_Permissions_group_idx` (`group_id` ASC),
  CONSTRAINT `fk_Permissions_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `ULib`.`StaffRoles` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Permissions_group`
    FOREIGN KEY (`group_id`)
    REFERENCES `ULib`.`Groups` (`group_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`sessions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`sessions` ;

CREATE TABLE IF NOT EXISTS `ULib`.`sessions` (
  `session_id` VARCHAR(255) NOT NULL,
  `staff_id` INT(11) NULL,
  `data` TEXT NULL,
  `expires` INT NULL,
  PRIMARY KEY (`session_id`),
  INDEX `fk_Sessions_1_idx` (`staff_id` ASC),
  CONSTRAINT `fk_Sessions_1`
    FOREIGN KEY (`staff_id`)
    REFERENCES `ULib`.`Staffs` (`staff_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`AccessLogs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`AccessLogs` ;

CREATE TABLE IF NOT EXISTS `ULib`.`AccessLogs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `access_time` DATETIME NOT NULL,
  `access_type` VARCHAR(10) NULL,
  `log_time` DATETIME NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_AccessLogs_1_idx` (`user_id` ASC),
  CONSTRAINT `fk_AccessLogs_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ULib`.`Staffs` (`staff_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `ULib`.`Categories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Categories` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Categories` (
  `category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `loan_time` INT NULL DEFAULT 0,
  `is_lock` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`category_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`Publishers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Publishers` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Publishers` (
  `publisher_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` TEXT NULL,
  `is_lock` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`publisher_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`Books`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Books` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Books` (
  `book_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `publisher_id` INT NULL,
  `name` VARCHAR(45) NOT NULL,
  `number` INT NOT NULL DEFAULT 0,
  `available_number` INT NOT NULL DEFAULT 0,
  `description` TEXT NULL,
  `image` VARCHAR(255) NULL,
  PRIMARY KEY (`book_id`, `category_id`, `language_id`),
  INDEX `fk_Books_1_idx` (`category_id` ASC),
  INDEX `fk_Books_Language_idx` (`language_id` ASC),
  INDEX `fk_Books_Publisher_idx` (`publisher_id` ASC),
  CONSTRAINT `fk_Books_Category`
    FOREIGN KEY (`category_id`)
    REFERENCES `ULib`.`Categories` (`category_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Books_Language`
    FOREIGN KEY (`language_id`)
    REFERENCES `ULib`.`Languages` (`language_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Books_Publisher`
    FOREIGN KEY (`publisher_id`)
    REFERENCES `ULib`.`Publishers` (`publisher_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `ULib`.`Authors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Authors` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Authors` (
  `author_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` TEXT NULL,
  `image` VARCHAR(250) NULL,
  PRIMARY KEY (`author_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`Students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Students` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Students` (
  `student_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `subject` VARCHAR(45) NULL,
  `gender` VARCHAR(5) NULL DEFAULT 'boy',
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`student_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `ULib`.`Loans`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Loans` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Loans` (
  `loan_id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_return` INT NULL DEFAULT 0,
  PRIMARY KEY (`loan_id`),
  INDEX `fk_Loans_studentId_idx` (`student_id` ASC),
  INDEX `fk_Loans_staffId_idx` (`staff_id` ASC),
  CONSTRAINT `fk_Loans_studentId`
    FOREIGN KEY (`student_id`)
    REFERENCES `ULib`.`Students` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Loans_staffId`
    FOREIGN KEY (`staff_id`)
    REFERENCES `ULib`.`Staffs` (`staff_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`LoanDetails`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`LoanDetails` ;

CREATE TABLE IF NOT EXISTS `ULib`.`LoanDetails` (
  `loandetail_id` INT NOT NULL AUTO_INCREMENT,
  `loan_id` INT NOT NULL,
  `book_id` INT NOT NULL,
  `returned_time` TIMESTAMP NULL,
  `is_return` TINYINT NOT NULL DEFAULT 0,
  `forfeit` INT NULL DEFAULT 0,
  `description` TEXT NULL,
  PRIMARY KEY (`loandetail_id`),
  INDEX `fk_LoanDetails_load_idx` (`loan_id` ASC),
  INDEX `fk_LoanDetails_book_idx` (`book_id` ASC),
  CONSTRAINT `fk_LoanDetails_load`
    FOREIGN KEY (`loan_id`)
    REFERENCES `ULib`.`Loans` (`loan_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_LoanDetails_book`
    FOREIGN KEY (`book_id`)
    REFERENCES `ULib`.`Books` (`book_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`Services`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Services` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Services` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`ServiceLogs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`ServiceLogs` ;

CREATE TABLE IF NOT EXISTS `ULib`.`ServiceLogs` (
  `servicelog_id` INT NOT NULL AUTO_INCREMENT,
  `service_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `prices` INT NULL,
  `note` TEXT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`servicelog_id`, `service_id`, `staff_id`),
  INDEX `fk_ServiceLogs_staff_idx` (`staff_id` ASC),
  INDEX `fk_ServiceLogs_service_type_idx` (`service_id` ASC),
  CONSTRAINT `fk_ServiceLogs_service_type`
    FOREIGN KEY (`service_id`)
    REFERENCES `ULib`.`Services` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ServiceLogs_staff`
    FOREIGN KEY (`staff_id`)
    REFERENCES `ULib`.`Staffs` (`staff_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`BookToAuthor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`BookToAuthor` ;

CREATE TABLE IF NOT EXISTS `ULib`.`BookToAuthor` (
  `book_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  INDEX `fk_BookToAuthor_toAuthor_idx` (`author_id` ASC),
  CONSTRAINT `fk_BookToAuthor_toBook`
    FOREIGN KEY (`book_id`)
    REFERENCES `ULib`.`Books` (`book_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BookToAuthor_toAuthor`
    FOREIGN KEY (`author_id`)
    REFERENCES `ULib`.`Authors` (`author_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'A book can have a lots of author.';


-- -----------------------------------------------------
-- Table `ULib`.`Settings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Settings` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `value` TEXT NULL,
  `status` TINYINT NULL DEFAULT 1,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`LibRules`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`LibRules` ;

CREATE TABLE IF NOT EXISTS `ULib`.`LibRules` (
  `name` VARCHAR(45) NOT NULL,
  `value` TEXT NULL,
  `description` TEXT NULL,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`name`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`Imports`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Imports` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Imports` (
  `import_id` INT NOT NULL AUTO_INCREMENT,
  `description` TEXT NULL,
  `created` DATETIME NULL,
  PRIMARY KEY (`import_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`Booking`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`Booking` ;

CREATE TABLE IF NOT EXISTS `ULib`.`Booking` (
  `booking_id` INT NOT NULL AUTO_INCREMENT,
  `book_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `created` DATETIME NULL,
  `number` INT NOT NULL DEFAULT 0,
  `status` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`booking_id`, `student_id`, `book_id`),
  INDEX `fk_book_id_idx` (`book_id` ASC),
  INDEX `fk_student_idx` (`student_id` ASC),
  CONSTRAINT `fk_book__id`
    FOREIGN KEY (`book_id`)
    REFERENCES `ULib`.`Books` (`book_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_student__id`
    FOREIGN KEY (`student_id`)
    REFERENCES `ULib`.`Students` (`student_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ULib`.`ImportDetails`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ULib`.`ImportDetails` ;

CREATE TABLE IF NOT EXISTS `ULib`.`ImportDetails` (
  `detail_id` INT NOT NULL,
  `import_id` INT NOT NULL,
  `book_id` INT NOT NULL,
  `number` VARCHAR(45) NULL,
  PRIMARY KEY (`detail_id`, `import_id`, `book_id`),
  INDEX `fk_ImportDetails_1_idx` (`import_id` ASC),
  INDEX `fk_ImportDetails_2_idx` (`book_id` ASC),
  CONSTRAINT `fk_ImportDetails_1`
    FOREIGN KEY (`import_id`)
    REFERENCES `ULib`.`Imports` (`import_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ImportDetails_2`
    FOREIGN KEY (`book_id`)
    REFERENCES `ULib`.`Books` (`book_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `ULib` ;

-- -----------------------------------------------------
-- procedure FindLoanById
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`FindLoanById`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `FindLoanById` (loan_id INT)
BEGIN
	SELECT *, Students.name as student_name, Books.name as book_name, Categories.name as category_name
    
    FROM Loans, LoanDetails, Students, Books, Categories
		WHERE Loans.loan_id = loan_id
		AND Loans.loan_id = LoanDetails.loan_id
		AND Loans.student_id = Students.student_id
		AND Books.book_id = LoanDetails.book_id
        AND Categories.category_id = Books.category_id;
END
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure FindLoanByStudentId
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`FindLoanByStudentId`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `FindLoanByStudentId` (student_id INT)
BEGIN
	SELECT * FROM Loans, LoanDetails, Students, Books 
		WHERE Loans.student_id = student_id
		AND Loans.loan_id = LoanDetails.loandetail_id
		AND Loans.student_id = Students.student_id
		AND Books.book_id = LoanDetails.book_id;
END

$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure ShowAllLoans
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`ShowAllLoans`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `ShowAllLoans` ()
BEGIN
	SELECT * FROM Loans;
END
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure UpdateLibRule
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`UpdateLibRule`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `UpdateLibRule` (_name VARCHAR(45), _value TEXT)
BEGIN
	
	UPDATE `LibRules`
    SET value = _value
    WHERE name = _name;
END
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GetLoanNotReturn
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`GetLoanNotReturn`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `GetLoanNotReturn` ()
BEGIN
	SELECT DISTINCT Loans.*, Students.* FROM Loans, LoanDetails, Students
	WHERE 
		Loans.loan_id = LoanDetails.loan_id
        AND Students.student_id = Loans.student_id
		AND LoanDetails.is_return <> 1;
END
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GetLoanNotReturnByUid
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`GetLoanNotReturnByUid`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `GetLoanNotReturnByUid` (_student_id INT)
BEGIN
	SELECT DISTINCT *, Loans.*, LoanDetails.*, Students.name as student_name, Books.name as book_name
    FROM Loans, LoanDetails, Students, Books
	WHERE 
		Loans.loan_id = LoanDetails.loan_id
        AND Loans.student_id = _student_id
        AND Students.student_id = Loans.student_id
		AND LoanDetails.is_return <> 1
        AND Books.book_id = LoanDetails.book_id;
END
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure ReturnTheBook
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`ReturnTheBook`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `ReturnTheBook` (_loanId int, _bookId int)
BEGIN
	UPDATE LoanDetails 
    SET 
		is_return = 1 
        AND returned_time = now()
	WHERE 
		book_id = _bookId AND loan_id = _loanId;
        
	UPDATE Books 
    SET `available_number` = `available_number` + 1
    WHERE 
		book_id = _bookId;
END
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure raise_application_error
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`raise_application_error`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `raise_application_error` (IN CODE INTEGER, IN MESSAGE VARCHAR(255)) SQL SECURITY INVOKER DETERMINISTIC
BEGIN
  CREATE TEMPORARY TABLE IF NOT EXISTS RAISE_ERROR(F1 INT NOT NULL);

  SELECT CODE, MESSAGE INTO @error_code, @error_message;
  INSERT INTO RAISE_ERROR VALUES(NULL);
END;$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure get_last_custom_error
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`get_last_custom_error`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `get_last_custom_error` () SQL SECURITY INVOKER DETERMINISTIC
BEGIN
  SELECT @error_code, @error_message;
END;$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GetBookOutOfDateByLoanId
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`GetBookOutOfDateByLoanId`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `GetBookOutOfDateByLoanId` (_loandId INT)
BEGIN
	-- CREATE temporary TABLE LoanDetailOutOfDate (id int) AS (SELECT 1 FROM Loans);

	DECLARE v_loanDetailId INT;
    DECLARE v_loanId INT;
    DECLARE v_bookId INT;
    DECLARE v_categoryId INT;
    DECLARE v_loanTime INT;
    DECLARE v_loanCreated DATETIME;

    SET v_loanId = _loanId;
    SET v_loanDetailId = 1;

    SELECT time_created INTO v_loanCreated FROM Loans WHERE loan_id = _loanId;

	WHILE v_loanDetailId > 1 DO
			SELECT loandetail_id, book_id INTO v_loanDetailId, v_bookId 
				FROM LoanDetails
				WHERE loan_id = v_loanId AND `is_return` = 0;
			
			IF v_bookId > 0 THEN
				SELECT loan_time INTO v_loanTime FROM Categories WHERE category_id IN (
					SELECT category_id 
						FROM Books 
						WHERE book_id = v_bookId
				);
				
				IF (DATEDIFF(NOW(), v_loanCreated) > v_loanTime) THEN
					INSERT INTO LoanDetailOutOfDate VALUES (v_loanDetailId);
				END IF;

			END IF;
	END WHILE;

	SELECT * FROM LoanDetails WHERE loandetail_id IN (SELECT * FROM LoanDetailOutOfDate);
END;
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure NewCategory_WithLock
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`NewCategory_WithLock`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `NewCategory_WithLock` (_name VARCHAR(255), _description TEXT, _loanTime INT)
BEGIN
	DECLARE _currentMaxId INT;
	SET TRANSACTION isolation LEVEL READ COMMITTED;
	
    START TRANSACTION;
		
		SELECT MAX(category_id) INTO _currentMaxId FROM `Categories`;
		
		INSERT 
			INTO `Categories` (`category_id`, `name`, `description`, `loan_time`) 
			VALUES (_currentMaxId + 1, _name, _description, _loanTime);
	COMMIT;
END;
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure Delay_NewCategory_WithLock
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`Delay_NewCategory_WithLock`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `Delay_NewCategory_WithLock` (_name VARCHAR(255), _description TEXT, _loanTime INT)
BEGIN
	DECLARE _currentMaxId INT;
	SET TRANSACTION isolation LEVEL READ COMMITTED;
	
    START TRANSACTION;
		
		SELECT MAX(category_id) INTO _currentMaxId FROM `Categories`;
		
        DO SLEEP(6);

		INSERT 
			INTO `Categories` (`category_id`, `name`, `description`, `loan_time`) 
			VALUES (_currentMaxId + 1, _name, _description, _loanTime);
	COMMIT;
END;
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure NewCategory
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`NewCategory`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `NewCategory` (_id INT, _name VARCHAR(255), _description TEXT, _loanTime INT)
BEGIN
	START TRANSACTION;
		INSERT 
			INTO `Categories` (`category_id`, `name`, `description`, `loan_time`) 
			VALUES (_id, _name, _description, _loanTime);
	COMMIT;
END;
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure NewCategory_Delay
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`NewCategory_Delay`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `NewCategory_Delay` (_id INT, _name VARCHAR(255), _description TEXT, _loanTime INT)
BEGIN
	START TRANSACTION;
		INSERT 
			INTO `Categories` (`category_id`, `name`, `description`, `loan_time`) 
			VALUES (_id, _name, _description, _loanTime);
		SELECT SLEEP(5);
	COMMIT;
END;
$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure NewCategory_Delay_WithLock
-- -----------------------------------------------------

USE `ULib`;
DROP procedure IF EXISTS `ULib`.`NewCategory_Delay_WithLock`;

DELIMITER $$
USE `ULib`$$
CREATE PROCEDURE `NewCategory_Delay_WithLock` (_name VARCHAR(255), _description TEXT, _loanTime INT)
BEGIN
	DECLARE _currentMaxId INT;
	SET TRANSACTION isolation LEVEL READ COMMITTED;
    SET AUTOCOMMIT = 0;
    
    START TRANSACTION;
		
		SELECT MAX(category_id) INTO _currentMaxId FROM `Categories`;
		SELECT SLEEP(5);
        
		INSERT 
			INTO `Categories` (`category_id`, `name`, `description`, `loan_time`) 
			VALUES (_currentMaxId + 1, _name, _description, _loanTime);
	COMMIT;
END;
$$

DELIMITER ;

-- -----------------------------------------------------
-- function GetLibRule
-- -----------------------------------------------------

USE `ULib`;
DROP function IF EXISTS `ULib`.`GetLibRule`;

DELIMITER $$
USE `ULib`$$
CREATE FUNCTION `GetLibRule` (_ruleName TEXT)
RETURNS TEXT
DETERMINISTIC
BEGIN
	DECLARE result TEXT;
    SET result = (SELECT `value` FROM LibRules WHERE `name` = _ruleName);
    
    RETURN result;
END
$$

DELIMITER ;

-- -----------------------------------------------------
-- function IsCanBooking
-- -----------------------------------------------------

USE `ULib`;
DROP function IF EXISTS `ULib`.`IsCanBooking`;

DELIMITER $$
USE `ULib`$$
CREATE FUNCTION `IsCanBooking` (_intBookId INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
	DECLARE _canBooking BOOLEAN DEFAULT false;
	SET @min_number = GetLibRule('min_number_of_books');
    
    SELECT true INTO _canBooking 
		FROM Books 
        WHERE 
			book_id = _intBookId 
            AND available_number >= @min_number;
	
    RETURN _canBooking;
END
$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `ULib`.`Languages`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Languages` (`language_id`, `name`, `description`) VALUES (1, 'English', 'English Books');
INSERT INTO `ULib`.`Languages` (`language_id`, `name`, `description`) VALUES (2, 'Vietnamese', 'Vietnamese Books');
INSERT INTO `ULib`.`Languages` (`language_id`, `name`, `description`) VALUES (3, 'Iraq', '');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Groups`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Groups` (`group_id`, `name`, `description`) VALUES (1, 'Supper Admin', 'Supper Admin Can do anythings');
INSERT INTO `ULib`.`Groups` (`group_id`, `name`, `description`) VALUES (2, 'Admin', 'Admin for System');
INSERT INTO `ULib`.`Groups` (`group_id`, `name`, `description`) VALUES (3, 'Default', 'Default Office Group');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Staffs`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Staffs` (`staff_id`, `username`, `email`, `password`, `name`, `phone_number`, `group_id`, `gender`, `birthday`) VALUES (1, 'lvduit', 'lvduit08@gmail.com', '$2a$08$DPd0cw/Dtccoclhv3ySXquq67JuHWytNVm1xsieq4I481H5WHnr/K', 'Van-Duyet Le', '01662626009', 1, '1', '');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`StaffRoles`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`StaffRoles` (`role_id`, `key`, `name`, `description`) VALUES (1, 'user-manager', 'User manager', 'Manager for User');
INSERT INTO `ULib`.`StaffRoles` (`role_id`, `key`, `name`, `description`) VALUES (2, 'groups', 'Group manager', 'Manager for Groups');
INSERT INTO `ULib`.`StaffRoles` (`role_id`, `key`, `name`, `description`) VALUES (3, 'categories', 'Categories Manager', 'Manager for Categories');
INSERT INTO `ULib`.`StaffRoles` (`role_id`, `key`, `name`, `description`) VALUES (4, 'books', 'Books Manager', 'Manager for Books');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Permissions`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Permissions` (`group_id`, `role_id`) VALUES (1, 1);
INSERT INTO `ULib`.`Permissions` (`group_id`, `role_id`) VALUES (1, 2);
INSERT INTO `ULib`.`Permissions` (`group_id`, `role_id`) VALUES (1, 3);
INSERT INTO `ULib`.`Permissions` (`group_id`, `role_id`) VALUES (1, 4);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Categories`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Categories` (`category_id`, `name`, `description`, `loan_time`, `is_lock`) VALUES (1, 'Giáo trình', 'Giáo trình', 120, NULL);
INSERT INTO `ULib`.`Categories` (`category_id`, `name`, `description`, `loan_time`, `is_lock`) VALUES (2, 'Anh Văn', 'Sách Anh Văn', 120, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Publishers`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Publishers` (`publisher_id`, `name`, `description`, `is_lock`) VALUES (1, 'NXB Kim Đồng', '', NULL);
INSERT INTO `ULib`.`Publishers` (`publisher_id`, `name`, `description`, `is_lock`) VALUES (2, 'NXH DHQG', '', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Books`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Books` (`book_id`, `category_id`, `language_id`, `publisher_id`, `name`, `number`, `available_number`, `description`, `image`) VALUES (1, 1, 1, 1, 'Lập trình C', 1500, 1000, 'Lập trình C', '/');
INSERT INTO `ULib`.`Books` (`book_id`, `category_id`, `language_id`, `publisher_id`, `name`, `number`, `available_number`, `description`, `image`) VALUES (2, 1, 1, 1, 'Lập trình Java', 1500, 1000, 'Java Web', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Authors`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Authors` (`author_id`, `name`, `description`, `image`) VALUES (1, 'Dang Tuan Nguyen', 'University of Information Technology, VNU- HCM', NULL);
INSERT INTO `ULib`.`Authors` (`author_id`, `name`, `description`, `image`) VALUES (2, 'Đỗ Phúc', NULL, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Students`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521092, 'Đặng Thái Sơn', 'Chương trình tiên tiến', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521087, 'Lưu Quang Vinh', 'Cử nhân tài năng', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521090, 'Lê Vũ Phát', 'Chương trình tiên tiến', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521096, 'Ngô Quốc  Tiến', 'Tân sinh viên', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520008, 'Nguyễn Trần An', 'Tân sinh viên', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521099, 'Phùng Đào Vĩnh Chung', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521094, 'Huỳnh Viết Trường', 'Chương trình tiên tiến', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521093, 'Hoàng Phạm Thanh Tài', 'Chương trình tiên tiến', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521103, 'Võ Nhựt Thường', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521097, 'Đào Duy Tùng', 'Công nghệ phần mềm', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521101, 'Đặng Quốc Dũng', 'Tân sinh viên', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520005, 'Lê Đức Ân', 'Tân sinh viên', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520006, 'Lê Phan Trường An', 'An ninh thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521084, 'Nguyễn Trần Phụng', 'Khoa học máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520021, 'Nghiêm Lan Anh', 'Công nghệ phần mềm', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521098, 'Đào Duy  Tùng', 'Tân sinh viên', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521100, 'Phùng Hữu  Đăng', 'Tân sinh viên', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521102, 'Lê Nhật Huy', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520007, 'Ngô Duy Ân', 'Công nghệ phần mềm', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520011, 'Tạ Thoại Ân', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520001, 'Huỳnh Tấn Ái', 'BM Khoa học & Kỹ thuật thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520024, 'Nguyễn Lê Tuấn Anh', 'Hệ thống thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (13521105, 'Nguyễn Huỳnh Anh Tuấn', 'Chương trình tiên tiến', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520022, 'Nguyễn Đức Anh', 'BM Khoa học & Kỹ thuật thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520002, 'Đỗ Phú An', 'Khoa học máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520010, 'Phạm Nữ Tuyết An', 'Công nghệ phần mềm', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520019, 'Lê Nguyễn Hoàng Anh', 'Khoa học máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520003, 'Đoàn Thành An', 'An ninh thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520020, 'Lương Quốc Anh', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520017, 'Lê Hùng Anh', 'Công nghệ phần mềm', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520016, 'Hoàng Văn Anh', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520015, 'Đàm Nhật Anh', 'Tân sinh viên', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520013, 'Vũ Nguyễn Hồng Ân', 'An ninh thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520004, 'Hoàng Văn An', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520018, 'Lê Huỳnh Tuấn Anh', 'Hệ thống thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520009, 'Nguyễn Trần Minh An', 'Hệ thống thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520027, 'Nguyễn Tuấn Anh', 'Tân sinh viên', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520025, 'Nguyễn Ngọc Anh', 'Khoa học máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520026, 'Nguyễn Quốc Anh', 'Hệ thống thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520014, 'Bùi Hoàng Anh', 'Chương trình tiên tiến', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520034, 'Tạ Thành Việt Anh', 'Công nghệ phần mềm', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520028, 'Nguyễn Tuấn Anh', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520012, 'Trần Minh An', '', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520030, 'Phạm Hoàng Anh', 'Hệ thống thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520037, 'Trần Như Tuấn Anh', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520031, 'Phạm Quốc Anh', 'Khoa học máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520038, 'Trần Văn Anh', 'BM Khoa học & Kỹ thuật thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520029, 'Nguyễn Tuấn Anh', 'Công nghệ phần mềm', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520036, 'Trần Lưu Anh', 'Mạng máy tính & truyền thông', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520023, 'Nguyễn Kỳ Anh', 'Mạng máy tính & truyền thông', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520033, 'Phan Việt Anh', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520040, 'Trương Phúc Anh', 'Cử nhân tài năng', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520035, 'Trần Đức Anh', 'Kỹ thuật máy tính', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520039, 'Trần Việt Anh', 'Công nghệ phần mềm', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520032, 'Phan Minh Ánh', 'Mạng máy tính & truyền thông', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520042, 'Nguyễn Hoài Bắc', 'Hệ thống thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520041, 'Nguyễn Ngọc Hải Âu', 'An ninh thông tin', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520043, 'Nguyễn Văn Bắc', 'Mạng máy tính & truyền thông', '', '');
INSERT INTO `ULib`.`Students` (`student_id`, `name`, `subject`, `gender`, `email`) VALUES (14520044, 'Trịnh Nguyên Bác', 'An ninh thông tin', '', '');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Loans`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Loans` (`loan_id`, `student_id`, `staff_id`, `created`, `is_return`) VALUES (1, 13521090, 1, '2015-05-21 18:24:12', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`LoanDetails`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`LoanDetails` (`loandetail_id`, `loan_id`, `book_id`, `returned_time`, `is_return`, `forfeit`, `description`) VALUES (1, 1, 1, NULL, 0, NULL, NULL);
INSERT INTO `ULib`.`LoanDetails` (`loandetail_id`, `loan_id`, `book_id`, `returned_time`, `is_return`, `forfeit`, `description`) VALUES (2, 1, 2, NULL, 0, NULL, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Services`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Services` (`id`, `name`, `description`) VALUES (1, 'In ấn', '');
INSERT INTO `ULib`.`Services` (`id`, `name`, `description`) VALUES (2, 'Mượn phòng họp', '');
INSERT INTO `ULib`.`Services` (`id`, `name`, `description`) VALUES (3, 'Nước', '');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`Settings`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`Settings` (`id`, `name`, `value`, `status`) VALUES (1, 'language', 'en', 1);
INSERT INTO `ULib`.`Settings` (`id`, `name`, `value`, `status`) VALUES (2, 'languages', 'en,vi', 1);
INSERT INTO `ULib`.`Settings` (`id`, `name`, `value`, `status`) VALUES (3, 'debug_active', '0', 1);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ULib`.`LibRules`
-- -----------------------------------------------------
START TRANSACTION;
USE `ULib`;
INSERT INTO `ULib`.`LibRules` (`name`, `value`, `description`, `type`) VALUES ('min_number_of_books', '100', 'Số lượng sách tồn tối thiểu', 'number');
INSERT INTO `ULib`.`LibRules` (`name`, `value`, `description`, `type`) VALUES ('max_book_of_each_loan_student', '2', 'Số sách sinh viên mượn tối đa', 'number');
INSERT INTO `ULib`.`LibRules` (`name`, `value`, `description`, `type`) VALUES ('max_book_of_each_loan_trainer', '3', 'Số sách giảng viên mượn tối đa', 'number');
INSERT INTO `ULib`.`LibRules` (`name`, `value`, `description`, `type`) VALUES ('max_book_of_each_loan_highstudent', '3', 'Số sách sv cao học mượn tối đa', 'number');
INSERT INTO `ULib`.`LibRules` (`name`, `value`, `description`, `type`) VALUES ('max_book_of_each_loan_staff', '2', 'Số sách cán bộ mượn tối đa', 'number');
INSERT INTO `ULib`.`LibRules` (`name`, `value`, `description`, `type`) VALUES ('number_of_copies', '1', 'Số lượng mỗi loại sách được mượn ', 'number');
INSERT INTO `ULib`.`LibRules` (`name`, `value`, `description`, `type`) VALUES ('fines_for_timeout', '3000', 'Phạt quá hạn tài liệu', 'number');

COMMIT;

USE `ULib`;

DELIMITER $$

USE `ULib`$$
DROP TRIGGER IF EXISTS `ULib`.`Languages_BEFORE_DELETE` $$
USE `ULib`$$
CREATE DEFINER = CURRENT_USER TRIGGER `ULib`.`Languages_BEFORE_DELETE` 
BEFORE DELETE ON `Languages` FOR EACH ROW
BEGIN	
	IF `OLD`.`language_id` = 1 OR `OLD`.`language_id` = 2 THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Can not remove default language';
    END IF;
END;$$


USE `ULib`$$
DROP TRIGGER IF EXISTS `ULib`.`Groups_BEFORE_DELETE` $$
USE `ULib`$$
CREATE DEFINER = CURRENT_USER TRIGGER `Groups_BEFORE_DELETE` BEFORE DELETE ON `Groups` FOR EACH ROW
BEGIN
	IF (OLD.group_id = 1 OR OLD.group_id = 3) THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Can not remove default group';
	END IF;
END$$


USE `ULib`$$
DROP TRIGGER IF EXISTS `ULib`.`Staffs_BEFORE_INSERT` $$
USE `ULib`$$
CREATE DEFINER = CURRENT_USER TRIGGER `Staffs_BEFORE_INSERT` 
BEFORE INSERT ON `Staffs` FOR EACH ROW
BEGIN
	SET NEW.group_id = 3;
END;$$


USE `ULib`$$
DROP TRIGGER IF EXISTS `ULib`.`Books_BEFORE_DELETE` $$
USE `ULib`$$
CREATE DEFINER = CURRENT_USER TRIGGER `Books_BEFORE_DELETE` BEFORE DELETE ON `Books` FOR EACH ROW
BEGIN 
	IF EXISTS (SELECT * from `LoanDetails` where `LoanDetails`.`book_id` = `OLD`.`book_id`) THEN 
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'This book is already exists in some loans!';
	END IF;
END;$$


USE `ULib`$$
DROP TRIGGER IF EXISTS `ULib`.`Loans_BEFORE_INSERT` $$
USE `ULib`$$
CREATE DEFINER = CURRENT_USER TRIGGER `Loans_BEFORE_INSERT` 
BEFORE INSERT ON `Loans` FOR EACH ROW
BEGIN 
	SET NEW.created = current_timestamp();
END;$$


USE `ULib`$$
DROP TRIGGER IF EXISTS `ULib`.`LoanDetails_BEFORE_INSERT` $$
USE `ULib`$$
CREATE DEFINER = CURRENT_USER TRIGGER `LoanDetails_BEFORE_INSERT` 
BEFORE INSERT ON `LoanDetails` FOR EACH ROW
BEGIN
	IF NEW.is_return = 1 THEN 
		SET NEW.returned_time = current_timestamp();
	END IF;
END;$$


USE `ULib`$$
DROP TRIGGER IF EXISTS `ULib`.`LoanDetails_AFTER_INSERT` $$
USE `ULib`$$
CREATE DEFINER = CURRENT_USER TRIGGER `LoanDetails_AFTER_INSERT` 
AFTER INSERT ON `LoanDetails` FOR EACH ROW
BEGIN
	DECLARE _return_num INT;
	SELECT COUNT(is_return) INTO  _return_num FROM LoanDetails WHERE loan_id = NEW.loan_id AND is_return = 1;
    IF _return_num = (SELECT COUNT(*) FROM LoanDetails WHERE loan_id = NEW.loan_id) THEN
		UPDATE Loans SET is_return = 1 WHERE loan_id = NEW.loan_id;
    END IF;
END;
    $$


USE `ULib`$$
DROP TRIGGER IF EXISTS `ULib`.`LoanDetails_BEFORE_UPDATE` $$
USE `ULib`$$
CREATE DEFINER = CURRENT_USER TRIGGER `LoanDetails_BEFORE_UPDATE` 
BEFORE UPDATE ON `LoanDetails` FOR EACH ROW
BEGIN
	IF NEW.is_return = 1 THEN 
		SET NEW.returned_time = current_timestamp();
	END IF;
END;$$


USE `ULib`$$
DROP TRIGGER IF EXISTS `ULib`.`LoanDetails_AFTER_UPDATE` $$
USE `ULib`$$
CREATE DEFINER = CURRENT_USER TRIGGER `LoanDetails_AFTER_UPDATE` 
AFTER UPDATE ON `LoanDetails` FOR EACH ROW
BEGIN
	DECLARE _return_num INT;
	SELECT COUNT(is_return) INTO  _return_num FROM LoanDetails WHERE loan_id = NEW.loan_id AND is_return = 1;
    IF _return_num = (SELECT COUNT(*) FROM LoanDetails WHERE loan_id = NEW.loan_id) THEN
		UPDATE Loans SET is_return = 1 WHERE loan_id = NEW.loan_id;
    END IF;
END;
    $$


DELIMITER ;
