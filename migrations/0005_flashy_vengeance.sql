ALTER TYPE "public"."account_status" ADD VALUE 'UNDER_REVIEW';--> statement-breakpoint
ALTER TABLE "brands" RENAME TO "merchants";--> statement-breakpoint
ALTER TABLE "merchants" RENAME COLUMN "phone_number" TO "phone";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "phone_number" TO "phone";--> statement-breakpoint
ALTER TABLE "merchants" DROP CONSTRAINT "brands_id_unique";--> statement-breakpoint
ALTER TABLE "merchants" DROP CONSTRAINT "brands_slug_unique";--> statement-breakpoint
ALTER TABLE "merchants" DROP CONSTRAINT "brands_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_brand_id_brands_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_brand_id_brands_id_fk";
--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "status" "account_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_brand_id_merchants_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."merchants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_merchants_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_slug_unique" UNIQUE("slug");