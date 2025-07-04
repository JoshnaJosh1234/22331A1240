const logs = [];

export const logEvent = (event) => {
  logs.push({ timestamp: new Date().toISOString(), ...event });
};

export const getLogs = () => logs;