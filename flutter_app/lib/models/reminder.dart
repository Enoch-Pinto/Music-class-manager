class Reminder {
  final String id;
  final ReminderType type;
  final String title;
  final String message;
  final DateTime? dueDate;
  final bool read;
  final DateTime timestamp;

  Reminder({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    this.dueDate,
    this.read = false,
    required this.timestamp,
  });

  Reminder copyWith({
    String? id,
    ReminderType? type,
    String? title,
    String? message,
    DateTime? dueDate,
    bool? read,
    DateTime? timestamp,
  }) {
    return Reminder(
      id: id ?? this.id,
      type: type ?? this.type,
      title: title ?? this.title,
      message: message ?? this.message,
      dueDate: dueDate ?? this.dueDate,
      read: read ?? this.read,
      timestamp: timestamp ?? this.timestamp,
    );
  }
}

enum ReminderType {
  payment,
  classSchedule,
  alert,
}
