CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
ALTER TABLE "merchants" RENAME TO "brands";--> statement-breakpoint
ALTER TABLE "order_items" RENAME COLUMN "merchant_id" TO "brand_id";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "merchant_id" TO "brand_id";--> statement-breakpoint
ALTER TABLE "brands" DROP CONSTRAINT "merchants_id_unique";--> statement-breakpoint
ALTER TABLE "brands" DROP CONSTRAINT "merchants_slug_unique";--> statement-breakpoint
ALTER TABLE "brands" DROP CONSTRAINT "merchants_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_merchant_id_merchants_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_merchant_id_merchants_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_number" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" "gender" DEFAULT 'MALE' NOT NULL;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_slug_unique" UNIQUE("slug");