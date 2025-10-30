class MusicClass {
  final int id;
  final String student;
  final DateTime date;
  final String time;
  final String instrument;
  final bool paid;
  final bool completed;
  final String? notes;

  MusicClass({
    required this.id,
    required this.student,
    required this.date,
    required this.time,
    required this.instrument,
    this.paid = false,
    this.completed = false,
    this.notes,
  });

  MusicClass copyWith({
    int? id,
    String? student,
    DateTime? date,
    String? time,
    String? instrument,
    bool? paid,
    bool? completed,
    String? notes,
  }) {
    return MusicClass(
      id: id ?? this.id,
      student: student ?? this.student,
      date: date ?? this.date,
      time: time ?? this.time,
      instrument: instrument ?? this.instrument,
      paid: paid ?? this.paid,
      completed: completed ?? this.completed,
      notes: notes ?? this.notes,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'student': student,
      'date': date.toIso8601String(),
      'time': time,
      'instrument': instrument,
      'paid': paid,
      'completed': completed,
      'notes': notes,
    };
  }

  factory MusicClass.fromJson(Map<String, dynamic> json) {
    return MusicClass(
      id: json['id'],
      student: json['student'],
      date: DateTime.parse(json['date']),
      time: json['time'],
      instrument: json['instrument'],
      paid: json['paid'] ?? false,
      completed: json['completed'] ?? false,
      notes: json['notes'],
    );
  }
}
