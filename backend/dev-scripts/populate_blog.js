const Database = require('better-sqlite3');
const db = new Database('d:/logowhistle/logowhistle-clone/backend/.tmp/data.db');

try {
  // 1. Populate blog_pages (Single Type)
  const existingPage = db.prepare("SELECT id FROM blog_pages").get();
  if (!existingPage) {
    db.prepare(`
      INSERT INTO blog_pages (
        page_title, 
        page_subtitle, 
        left_description, 
        right_description, 
        created_at, 
        updated_at, 
        published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Logo Design Blog',
      'Inspiring Ideas and Tips and Everything Around Logo Design',
      'Our blog is a curated space where we share insights, trends, and tutorials about the world of logo design. From understanding color psychology to mastering typography, we cover it all.',
      'Whether you are a budding designer or a business owner looking to understand branding better, our articles are crafted to provide value and inspiration for your next project.',
      Date.now(),
      Date.now(),
      Date.now()
    );
    console.log('Sample Blog Page data inserted.');
  } else {
    console.log('Blog Page data already exists.');
  }

  // 2. Populate blog_posts (Collection Type)
  const existingPosts = db.prepare("SELECT id FROM blog_posts").all();
  if (existingPosts.length === 0) {
    const posts = [
      {
        title: 'The Art of Minimalist Logo Design',
        slug: 'minimalist-logo-design',
        published_date: '2024-03-10',
        content: 'Minimalism is not just a trend; it is a philosophy...'
      },
      {
        title: 'Color Psychology in Branding',
        slug: 'color-psychology-branding',
        published_date: '2024-02-15',
        content: 'Colors evoke emotions and can significantly impact user perception...'
      },
      {
        title: 'Evolution of Famous Tech Logos',
        slug: 'tech-logo-evolution',
        published_date: '2024-01-20',
        content: 'Explore how top tech giants have rebranded over the decades...'
      }
    ];

    for (const post of posts) {
      db.prepare(`
        INSERT INTO blog_posts (
          title, 
          slug, 
          published_date, 
          content, 
          author, 
          category, 
          created_at, 
          updated_at, 
          published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        post.title,
        post.slug,
        post.published_date,
        post.content,
        'SEO Admin',
        'Logo Design',
        Date.now(),
        Date.now(),
        Date.now()
      );
    }
    console.log('Sample Blog Posts inserted.');
  } else {
    console.log('Blog Posts already exist.');
  }
} catch (err) {
  console.error('Error populating data:', err);
} finally {
  db.close();
}
