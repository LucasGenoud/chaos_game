<template>
  <div class="footer" :class="{ 'footer-dark': backgroundTheme === 'dark', 'footer-white': backgroundTheme === 'white' }">
    <div class="footer-content">
      <span>{{ userName }}</span>
      <div class="footer-links">
        <a :href="githubLink" target="_blank" rel="noopener noreferrer" class="footer-link">
          <svg class="footer-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          GitHub
        </a>
        <a :href="linkedinLink" target="_blank" rel="noopener noreferrer" class="footer-link">
          <svg class="footer-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
          LinkedIn
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userName: {
    type: String,
    default: "Your Name",
  },
  githubLink: {
    type: String,
    default: "https://github.com/yourusername",
  },
  linkedinLink: {
    type: String,
    default: "https://linkedin.com/in/yourusername",
  },
  backgroundTheme: {
    type: String,
    default: "dark",
  },
});
</script>

<style scoped>
.footer {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  transition: bottom 0.3s ease, opacity 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  opacity: 0.5;
}

.footer:hover {
  bottom: 20px;
  opacity: 1;
}

.footer-dark {
  color: white;
}

.footer-white {
  color: black;
}

.footer-content {
  backdrop-filter: blur(5px);
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
}

.footer-dark .footer-content {
  background-color: rgba(0, 0, 0, 0.6);
}

.footer-white .footer-content {
  background-color: rgba(255, 255, 255, 0.6);
}

.footer-links {
  display: flex;
  gap: 16px;
  margin-top: 4px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.footer-dark .footer-link {
  color: #8ab4f8;
}

.footer-white .footer-link {
  color: #0366d6;
}

.footer-link:hover {
  opacity: 0.8;
}

.footer-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>