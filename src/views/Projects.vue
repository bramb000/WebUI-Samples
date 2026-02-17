<template>
  <div class="projects-page">
    <h1>My Projects</h1>
    
    <div class="projects-grid">
      <router-link to="/login-interaction-1" class="project-card block no-underline text-inherit hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200">
        <h2 class="text-xl font-bold mb-2 text-[#3b3b3b]">Login Screen Micro Interaction 1</h2>
        <p class="text-gray-600">A playful login screen featuring a Rive-style animated avatar that tracks your input and reacts to password focus.</p>
        <div class="mt-4 text-[#2cd203] font-medium">View Interaction &rarr;</div>
      </router-link>
      
      <div class="project-card">
        <h2>Project 2</h2>
        <p>Description of project 2.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.project-card {
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.project-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.project-card p {
  color: #666;
  margin: 0;
}
</style>
