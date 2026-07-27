const STORAGE_KEY = 'sheetflow_projects_v1';

export const getProjects = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading projects from localStorage:', e);
    return [];
  }
};

export const saveProject = (project) => {
  if (typeof window === 'undefined') return null;
  try {
    const projects = getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      projects[existingIndex] = updatedProject;
    } else {
      updatedProject.createdAt = new Date().toISOString();
      projects.unshift(updatedProject);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return updatedProject;
  } catch (e) {
    console.error('Error saving project to localStorage:', e);
    return null;
  }
};

export const getProjectById = (id) => {
  const projects = getProjects();
  return projects.find((p) => p.id === id) || null;
};

export const deleteProject = (id) => {
  if (typeof window === 'undefined') return false;
  try {
    const projects = getProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (e) {
    console.error('Error deleting project:', e);
    return false;
  }
};
