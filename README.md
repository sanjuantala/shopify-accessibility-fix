# Enhanced Shopify AccessiBe Accessibility Hotfix

**Version:** 2.0.0  
**Release Date:** 2025-07-24

---

## Description

A high-performance accessibility patch designed to **safely remove AccessiBe skip-links and redundant ARIA roles** from e-commerce websites. The script works silently in the background to ensure your site remains accessible without being interfered with by external overlays.

---

## Features

- Zero global variables (except optional debug flag)
- Automatic cleanup and robust error handling
- Customizable timing and retry logic
- Enhanced security and optimized performance
- Tested with Shopify, Magento, and universal (platform-agnostic) setups

---

## Compatibility

| Platform   | Support Status        |
|------------|------------------------|
| Shopify    | Supported and tested   |
| Magento    | Supported and tested   |
| Universal  | General compatibility  |

---

## Installation

Include the script via your platform's custom script loader, theme file, or integration tool:

```html
<!-- Example Shopify Theme Integration -->
<script src="path-to-your-hotfix.js" defer></script>
