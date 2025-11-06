# Contributing to MMA Athletic Disciplines Manager

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node/Python versions)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature has already been requested
- Clearly describe the feature and its use case
- Explain why it would be useful to most users

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/mma-tracker.git
   cd mma-tracker
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Test all affected functionality
   - Ensure no existing features break
   - Test on different screen sizes (responsive design)

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```

   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your feature branch
   - Provide a clear description of your changes

## Development Guidelines

### Frontend (React)

**File Structure:**
- Components go in `src/components/`
- Contexts go in `src/contexts/`
- Services/API calls go in `src/services/`
- Use functional components with hooks

**Styling:**
- Use TailwindCSS utility classes
- Maintain the dark theme aesthetic
- Ensure responsive design (mobile-first)
- Use existing color scheme for consistency

**Code Style:**
- Use meaningful variable names
- Keep components focused and reusable
- Extract repeated logic into custom hooks
- Use PropTypes or TypeScript for type safety

### Backend (Flask)

**File Structure:**
- Routes organized by feature (auth.py, workouts.py)
- Models in models.py
- Configuration in config.py
- Keep app.py minimal

**Security:**
- Never store passwords in plain text
- Validate all user inputs
- Use parameterized queries
- Implement proper authentication checks

**API Design:**
- Use RESTful conventions
- Return appropriate HTTP status codes
- Include error messages in responses
- Document new endpoints in README

**Code Style:**
- Follow PEP 8 guidelines
- Use type hints where applicable
- Add docstrings for functions
- Handle exceptions gracefully

## Testing

While this project doesn't currently have a formal test suite, please manually test:

**Frontend:**
- [ ] Registration flow
- [ ] Login flow
- [ ] Logout functionality
- [ ] Adding workouts
- [ ] Editing workouts
- [ ] Deleting workouts
- [ ] Analytics display
- [ ] Responsive design on mobile
- [ ] Error handling

**Backend:**
- [ ] All API endpoints work
- [ ] Authentication is enforced
- [ ] Data validation works
- [ ] Error handling is appropriate
- [ ] Database operations succeed

## Project Priorities

Current priorities for contributions:
1. **Testing**: Unit and integration tests
2. **Features**: See "Future Enhancements" in README
3. **Performance**: Optimization opportunities
4. **Documentation**: Improvements and examples
5. **Accessibility**: WCAG compliance improvements

## Questions?

If you have questions about contributing:
- Check the README.md first
- Open an issue with the "question" label
- Reach out to the maintainers

## Recognition

All contributors will be recognized in the project README. Thank you for helping make this project better!

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.
