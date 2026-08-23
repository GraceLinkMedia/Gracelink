# Editing the GraceLink Church Website

This is a plain-English guide for updating the website's content. You don't need any coding knowledge, a computer terminal, or special software — just a web browser, on your phone or a computer.

## Logging in

1. Go to **glchurch.co.uk/admin/**
2. Click **Login with GitHub**.
3. Sign in with your GitHub account (someone needs to give you access first — see the note at the bottom of this file if you don't have one yet).

You'll land on a dashboard listing everything you can edit, grouped into: **Pages**, **Leadership**, **Ministries**, and **Site Settings**.

## Changing text on a page

1. Click **Pages** in the sidebar, then click the page you want (e.g. "Home Page", "Give").
2. Change whatever text you like in the boxes shown.
3. Scroll to the bottom and click **Save** (or **Publish**, depending on what you see).
4. Your change goes live within about a minute — no need to tell anyone or do anything else.

Every page's boxes match what you see on the live site — a "Page Heading" box changes the big heading, a "Button Text" box changes what a button says, and so on. If a box's purpose isn't obvious, its label should tell you which part of the page it controls.

## Adding or editing a leader (Leadership page)

1. Click **Leadership** in the sidebar.
2. To edit someone already there, click their name. To add someone new, click **New Leadership**.
3. Fill in: their name, role (e.g. "Lead Pastor"), a photo, their bio (as one or more short paragraphs), and any social media links.
4. **Display Order** controls who appears first — lower numbers appear first (1 comes before 2).
5. Click **Save**.

## Adding or editing a ministry (Ministries page)

Same idea as Leadership:

1. Click **Ministries** in the sidebar.
2. Edit an existing one, or click **New Ministries** to add one.
3. Fill in the name, an optional short description, a photo, and an optional link.
4. Click **Save**.

## Uploading photos

Whenever you see an image box, click it to upload a new photo from your phone or computer. The system automatically compresses and resizes it — you don't need to shrink it yourself first, and you don't need to worry about file size.

## Changing service times, address, phone, or social links

These live in one place so you never have to hunt for them:

1. Click **Site Settings** in the sidebar → **Site Settings**.
2. Update the service time, address, phone number, email, social links, or ChurchSuite links.
3. Click **Save**.

This one place feeds the header, footer, home page, and contact page automatically — you only ever need to change it here.

## Events

The events calendar shown on the **Events** page is pulled directly from ChurchSuite — the same system used for giving and sign-up forms. Add or edit events in ChurchSuite as usual; they'll appear on the website automatically. There's nothing to update on the website itself when an event changes.

## What NOT to touch

- Don't edit anything under **Site Settings** unless you're sure — it affects every page at once.
- The "Display Order" and "Tags" fields on Leadership/Ministries entries control how things are sorted internally — leave "Tags" alone if you see it.
- If a field looks like a raw web address (starts with `http://` or `https://`) or a `tel:` link, double-check you haven't accidentally deleted a slash or colon before saving.
- There's no "undo" button, but every change is recorded in GitHub's history, so nothing is ever truly lost — ask whoever manages the website's code to help you roll back a mistake if needed.

## Getting access

To log in, you need:
1. A free GitHub account (github.com — sign up with your email).
2. To be added as a **collaborator** on the `GraceLinkMedia/Gracelink` repository — ask whoever manages the site to add you (GitHub → repo → Settings → Collaborators).

Once both of those are done, `glchurch.co.uk/admin/` will work for you.
