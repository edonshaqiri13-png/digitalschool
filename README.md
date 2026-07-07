# AI Education Website for Students

A clean, modern website designed to teach students aged 12-18 about artificial intelligence. The website features four sections: an engaging hero introduction, an explanation of what AI is, real-life examples of AI in daily life, and a secure authentication system powered by Supabase.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Modern UI**: Clean, engaging interface with smooth animations
- **Educational Content**: Clear explanations of AI concepts suitable for teens
- **Real-world Examples**: Shows how AI is used in YouTube recommendations, facial recognition, and adaptive learning
- **Authentication System**: Secure sign-up and login using Supabase Auth
- **User Profiles**: Personalized experience for logged-in users
- **Interactive Elements**: Hover effects and button animations

## Website Sections

1. **Hero Section**: Full-screen introduction with title, subtitle, and call-to-action button
2. **What is AI?**: Simple explanation of artificial intelligence and machine learning concepts
3. **AI in Daily Life**: Three practical examples with relevant emojis:
   - YouTube Recommendations
   - Face Unlock on phones
   - Duolingo adaptive learning
4. **Footer**: Branding with "Learn and create with AI, DigitalSchool 2026"

## Authentication System

The website includes a complete authentication system using Supabase:

- Secure user registration with email and password
- Login/logout functionality
- Session persistence
- Protected user profile display
- Modal-based auth interface

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Enable Email provider in Authentication > Settings > Providers
3. Run the SQL script in your Supabase SQL editor:

```sql
-- Create profiles table to store additional user data
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE NOW(),
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Function to automatically update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Optional: Trigger to automatically update updated_at on row updates
CREATE TRIGGER update_profiles_modtime 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE PROCEDURE public.update_updated_at_column();
```

4. Get your project URL and anon key from Settings > API
5. Replace the placeholder values in `script.js`:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

## File Structure

```
digitalschool/
├── index.html          # Main HTML structure
├── styles.css          # All styling including responsive design
├── script.js           # Supabase integration and UI interactions
├── supabase_setup.sql  # SQL for setting up Supabase backend
└── hello.txt           # Original test file
```

## How to Run

1. Clone or download this repository
2. Set up Supabase as described above
3. Update `script.js` with your Supabase credentials
4. Open `index.html` in any modern web browser
5. For local development, you can use a simple HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or with Node.js
   npx serve
   ```

## Customization

- **Colors**: Modify the CSS variables in `styles.css` (primary colors: #001f3f navy, #00ff9d accent)
- **Content**: Update text in `index.html` to customize educational material
- **Styling**: Adjust spacing, fonts, or animations in `styles.css`
- **Features**: Additional user profile fields can be added to the `profiles` table

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Security Notes

- Passwords are handled securely by Supabase Auth (bcrypt hashing)
- Email verification recommended for production use
- Row Level Security (RLS) can be enabled on the profiles table for additional protection
- Never expose your service_key or service_role key in client-side code

## Credits

Built with:
- HTML5, CSS3, JavaScript (ES6+)
- Supabase for authentication and database
- Google Fonts (Segoe UI fallback)
- UI Avatars for default user images

## License

MIT License - feel free to use, modify, and distribute for educational purposes.