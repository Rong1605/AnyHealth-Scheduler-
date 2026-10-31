# Account-verified demo bookings

This change closes the old anonymous booking endpoint and sends website visitors to the central AnyHEALTH meeting page.

- `POST /api/book` requires an existing, verified AnyHEALTH central-account bearer token before it checks availability or creates a calendar event.
- The recipient email comes from Supabase Auth, not `clientEmail` in a request body. The verified central user ID is recorded in the booking answers.
- `/book` and `/confirmed` redirect to `https://www.anyhealth.asia/meeting`, where users can sign in with email or Google and view their account's bookings.
- Existing Google Calendar, Gmail/SMTP, Supabase, practitioner notifications and availability settings are preserved. No new SQL or environment secret is needed. Public account configuration supplies only the existing central anon key; user verification calls the fixed central Auth URL.

The AnyHEALTH website/backend changes are separate. This scheduler change must also be deployed to close direct access to the old anonymous endpoint. A website-only login screen cannot secure that old endpoint.

The `Rong1605` GitHub account has read-only access to `swandust/AnyHealth-Scheduler-`. Its owner must merge/deploy this patch or grant write access before that old host can be declared protected. No credentials are included in the patch.
