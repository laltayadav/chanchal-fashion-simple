## Context

The store is currently a single App Router app with a shared public layout. Customers and admins are both routed through the same visible header, which makes the admin experience feel exposed and unpolished.

The goal is to improve the public customer flow while treating the admin section as a separate owner-facing experience.

## Goals

- Hide admin entry from the shop navigation.
- Keep public branding strong and uncluttered.
- Align admin content with the page grid and top padding.
- Make product image updates intuitive for the admin.
- Reduce repeated labels and brand elements on admin screens.

## Page-level wireframes

### Public shop header

```
┌─────────────────────────────────────────────────────────────────────┐
│ Chanchal                [Shop] [Cart]                 Cart: 0 items │
└─────────────────────────────────────────────────────────────────────┘
```

### Public home page

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Hero card]                                                         │
│   Chanchal Fashion                                                  │
│   Weave Your Own Story                                              │
│   Browse curated sari, blouse, and set collections.                 │
│                                                                     │
│ [Filter buttons]     [Cart summary chip]                            │
│                                                                     │
│ [Product grid]                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Admin entry and layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Chanchal • Admin                                                    │
└─────────────────────────────────────────────────────────────────────┘
│                                                                     │
│ [Admin dashboard card]                                               │
│   Manage products, orders, and shop settings.                       │
│                                                                     │
│ ┌─────────────────────────┐  ┌─────────────────────────────────────┐ │
│ │ Settings              │  │ Product editor                    │ │
│ │ - shop name           │  │ - name                            │ │
│ │ - WhatsApp number     │  │ - type                            │ │
│ │ - admin password      │  │ - category                        │ │
│ │                       │  │ - price                           │ │
│ │                       │  │ - discount price                   │ │
│ │                       │  │ - in-stock                        │ │
│ │                       │  │ - image upload / URL fallback      │ │
│ │                       │  │ [Preview]                          │ │
│ └─────────────────────────┘  └─────────────────────────────────────┘ │
│                                                                     │
│ [Order list]                                                         │
│   Recent orders with time, name, phone, total, and note.            │
└─────────────────────────────────────────────────────────────────────┘
```

### Admin image management

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Image preview / placeholder]                                        │
│                                                                     │
│ [Upload image] button          [Or paste image URL]                 │
│                                                                     │
│ Current image path: /uploads/...?                                    │
└─────────────────────────────────────────────────────────────────────┘
```

## UX Decisions

### Hide admin from public nav

The public site should only present customer actions: Shop and Cart. Admin access is not part of the customer journey.

### Use a dedicated admin header

A separate `AdminHeader` should display a compact brand badge and the page title. This prevents the admin page from visually inheriting the shop hero card.

### Keep admin layout aligned

Admin content should use the same `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` pattern as the shop pages. That fixes the current misalignment and creates consistency.

### Image upload + URL fallback

The admin form should support both:
- selecting or dragging a file to upload
- entering an existing image URL

A preview card should show the currently selected image immediately.

### Minimize repeated branding

Avoid both:
- `Chanchal Fashion` in the public shell header and again in the admin dashboard card
- `Admin Dashboard` plus repeated `Chanchal Fashion` page headings

Instead, use a single compact identity and a strong functional page title.
