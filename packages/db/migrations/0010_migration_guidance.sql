UPDATE "services" SET
	"slug" = 'migration-guidance',
	"name" = 'Migration Guidance',
	"category" = 'migration',
	"summary" = 'Moving to another country to live and work, from eligibility to arrival.',
	"intro_html" = 'If you want to live and work in another country, we work out where you qualify, which pathway fits, and take the application from there.',
	"steps" = '[
		{"title": "Where you stand", "body": "Your age, qualifications, work history and English, and what they count for."},
		{"title": "Choosing where to go", "body": "Australia, New Zealand, the United Kingdom or elsewhere, wherever your profile fits best."},
		{"title": "The right pathway", "body": "Skilled, work, business or family, whichever one your profile fits."},
		{"title": "Skills assessment and English", "body": "The assessing authority for your occupation, and the test score you need."},
		{"title": "Document preparation", "body": "Identity, qualifications, references, funds, health and character."},
		{"title": "Lodgement and follow-up", "body": "We lodge the application and track it until a decision."},
		{"title": "After the decision", "body": "Arrival, the first weeks, and what keeps the visa valid."}
	]'::jsonb,
	"documents" = '[
		{"label": "Passport and identity documents"},
		{"label": "Qualifications and academic transcripts"},
		{"label": "Skills assessment outcome"},
		{"label": "English test results (IELTS or PTE)"},
		{"label": "Employment references and payslips"},
		{"label": "Police and health checks"}
	]'::jsonb,
	"updated_at" = now()
WHERE "slug" = 'scholarship-guidance';--> statement-breakpoint
UPDATE "ui_strings" SET "key" = 'service.migration-guidance.label', "value" = 'Migration', "label" = 'Migration Guidance badge', "updated_at" = now() WHERE "key" = 'service.scholarship-guidance.label';--> statement-breakpoint
UPDATE "ui_strings" SET "key" = 'service.migration-guidance.stepsTitle', "value" = 'How migration guidance works', "label" = 'Migration Guidance steps heading', "updated_at" = now() WHERE "key" = 'service.scholarship-guidance.stepsTitle';--> statement-breakpoint
UPDATE "ui_strings" SET "key" = 'service.migration-guidance.listTitle', "value" = 'What the application needs', "label" = 'Migration Guidance documents heading', "updated_at" = now() WHERE "key" = 'service.scholarship-guidance.listTitle';--> statement-breakpoint
UPDATE "ui_strings" SET "value" = 'Education counselling, visa guidance, migration guidance and IELTS coaching.', "updated_at" = now() WHERE "key" = 'home.services.lead';--> statement-breakpoint
INSERT INTO "redirects" ("from_path", "to_path", "status_code", "is_active", "note")
VALUES ('/services/scholarship-guidance', '/services/migration-guidance', 301, true, 'Address changed from /services/scholarship-guidance to /services/migration-guidance')
ON CONFLICT ("from_path") DO NOTHING;
