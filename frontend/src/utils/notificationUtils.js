
export function generateNotifications(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const notifications = [];

    tasks.forEach((task) => {
        if (task.status === "COMPLETED" || !task.dueDate) {
            return;
        }

        const dueDate = new Date(`${task.dueDate}T00:00:00`);
        const daysRemaining = Math.ceil(
            (dueDate - today) / (1000 * 60 * 60 * 24)
        );

        if (daysRemaining < 0) {
            notifications.push({
                id: `overdue-${task.id}`,
                taskId: task.id,
                title: "Task overdue",
                message: `"${task.title}" is overdue.`,
                type: "OVERDUE",
                read: false
            });
        } else if (daysRemaining <= 2) {
            notifications.push({
                id: `upcoming-${task.id}`,
                taskId: task.id,
                title: "Upcoming deadline",
                message: `"${task.title}" is due ${
                    daysRemaining === 0
                        ? "today"
                        : daysRemaining === 1
                            ? "tomorrow"
                            : "in 2 days"
                }.`,
                type: "UPCOMING",
                read: false
            });
        }
    });


    return notifications;
}

export function getSavedNotifications(newNotifications) {
    let savedNotifications = [];

    try {
        const stored = JSON.parse(
            localStorage.getItem("notifications") || "[]"
        );

        savedNotifications = Array.isArray(stored) ? stored : [];
    } catch (error) {
        console.error("Invalid saved notifications:", error);
    }

    return newNotifications.map((notification) => {
        const savedNotification = savedNotifications.find(
            (saved) => saved.id === notification.id
        );

        return {
            ...notification,
            read: savedNotification
                ? savedNotification.read
                : false
        };
    });
}


