const STORAGE_KEY = 'sheetflow_projects_v1';
const SUBSCRIPTION_KEY = 'sheetflow_subscriptions_v1';

export const getProjects = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading projects:', e);
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
    console.error('Error saving project:', e);
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

// === SUBSCRIPTION & PLAN MANAGEMENT ===

export const getAllSubscriptions = () => {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(SUBSCRIPTION_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const getUserSubscription = (email) => {
  if (!email) return { plan: 'free', status: 'active', expiresAt: null };
  const subs = getAllSubscriptions();
  const userSub = subs[email.toLowerCase()];
  
  if (!userSub) {
    return { plan: 'free', status: 'active', expiresAt: null };
  }

  // Check if expired
  if (userSub.expiresAt && new Date(userSub.expiresAt) < new Date()) {
    return { plan: 'free', status: 'expired', expiresAt: userSub.expiresAt };
  }

  return userSub;
};

export const setUserSubscription = (email, plan, months = 1, note = '') => {
  if (typeof window === 'undefined' || !email) return false;
  try {
    const subs = getAllSubscriptions();
    const now = new Date();
    let expiresAt = null;

    if (plan !== 'free') {
      const exp = new Date(now);
      exp.setMonth(exp.getMonth() + months);
      expiresAt = exp.toISOString();
    }

    subs[email.toLowerCase()] = {
      plan, // 'free' | 'monthly' | 'yearly'
      status: 'active',
      activatedAt: now.toISOString(),
      expiresAt,
      note
    };

    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subs));
    return true;
  } catch (e) {
    console.error('Error saving subscription:', e);
    return false;
  }
};

export const isPaidPlan = (email) => {
  const sub = getUserSubscription(email);
  return (sub.plan === 'monthly' || sub.plan === 'yearly') && sub.status === 'active';
};
