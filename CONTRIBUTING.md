# Contributing to spaceSiM04

Thank you for your interest in contributing!

## Unified Asset Management Rules

This project uses a unified, config-driven asset management system for all models, textures, and sounds. **All asset paths must be defined in `assets/config.js` and loaded via the central `AssetManager` utility.**

### **You MUST:**
- Reference all assets (models, textures, sounds, etc.) from `CONFIG`.
- Use the asset manager for loading assets (never hardcode asset paths in modules).
- Add or update asset paths only in `assets/config.js`.
- If the asset workflow changes, update both `ASSET_WORKFLOW.md` and code comments.

### **You MUST NOT:**
- Hardcode asset paths (e.g., `'assets/models/foo.glb'`) in any module.
- Circumvent the asset manager or config system.

### **Documentation**
- See [ASSET_WORKFLOW.md](./ASSET_WORKFLOW.md) for detailed instructions, examples, and best practices.
- Inline code comments in each module also reference the asset workflow.

## Code Style & General Guidelines
- Follow existing code style and structure.
- Add descriptive comments for any new asset-loading logic.
- Test all asset loading and check for errors/warnings in the browser console.
- If you add new asset types or workflows, update documentation accordingly.

## Questions?
- If anything is unclear, please review the documentation or ask a maintainer before submitting your PR.

---

Happy coding!
