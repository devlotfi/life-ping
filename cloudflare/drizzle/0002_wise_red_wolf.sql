CREATE TABLE `Subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`endpoint` text NOT NULL,
	`expiration_time` integer,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Subscriptions_endpoint_unique` ON `Subscriptions` (`endpoint`);--> statement-breakpoint
DROP INDEX `Contacts_phone_number_unique`;--> statement-breakpoint
ALTER TABLE `Contacts` DROP COLUMN `phone_number`;