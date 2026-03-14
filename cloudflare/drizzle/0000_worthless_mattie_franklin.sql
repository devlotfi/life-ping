CREATE TABLE `Contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone_number` text,
	`created_at` integer DEFAULT (strftime('%s','now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Contacts_name_unique` ON `Contacts` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `Contacts_email_unique` ON `Contacts` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `Contacts_phone_number_unique` ON `Contacts` (`phone_number`);