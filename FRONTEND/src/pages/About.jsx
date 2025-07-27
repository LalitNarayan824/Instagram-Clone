const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-zinc-800 dark:text-zinc-100">
      <h1 className="text-4xl font-bold mb-2 text-center">📸 Instagram Clone</h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8">
        My own version of Instagram — built for fun, friends, and connection.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">✨ What You Can Do</h2>
        <ul className="space-y-3 list-disc list-inside text-base">
          <li>✅ <strong>Reels</strong> — Share short videos just like Insta Shorts</li>
          <li>✅ <strong>Stories</strong> — Temporary posts that vanish after 24 hours</li>
          <li>✅ <strong>Post, Like, Comment</strong> — Classic IG feel with real-time updates</li>
          <li>✅ <strong>Chat</strong> — Real-time messaging powered by <code>Socket.IO</code></li>
          <li>✅ <strong>Follow/Unfollow</strong> — Build your own friend circle</li>
          <li>✅ <strong>Notifications</strong> — Live alerts for likes, follows, and DMs 🔔</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🔒 Security & Performance</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>✅ <strong>JWT Auth</strong> for secure logins</li>
          <li>✅ <strong>MongoDB</strong> to store your posts, messages, and profiles</li>
          <li>✅ <strong>Cloudinary</strong> to handle image/video uploads</li>
          <li>✅ Fully responsive UI using <strong>Tailwind CSS</strong></li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">🛠️ Tech Stack</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>🔹 <strong>Frontend:</strong> ReactJS + Tailwind CSS</li>
          <li>🔹 <strong>Backend:</strong> Node.js + Express.js</li>
          <li>🔹 <strong>Database:</strong> MongoDB</li>
          <li>🔹 <strong>Real-Time:</strong> Socket.IO</li>
          <li>🔹 <strong>Media:</strong> Cloudinary</li>
          <li>🔹 <strong>Auth:</strong> JWT</li>
        </ul>
      </section>

      <p className="text-center mt-12 text-sm text-zinc-500 dark:text-zinc-400">
        💙 Built with love by Lalit. <a href="https://github.com/LalitNarayan824" className="text-blue-400 underline cursor-grab"> Check out my Github Profile</a>
      </p>
    </div>
  );
};

export default AboutPage;
