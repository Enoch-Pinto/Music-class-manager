import 'package:flutter/material.dart';
import '../models/music_class.dart';
import '../models/payment.dart';

class ClassProvider extends ChangeNotifier {
  final List<MusicClass> _classes = [
    MusicClass(
      id: 1,
      student: 'Alice Johnson',
      date: DateTime(2025, 10, 30),
      time: '14:00',
      instrument: 'Piano',
      paid: true,
      completed: false,
    ),
    MusicClass(
      id: 2,
      student: 'Bob Smith',
      date: DateTime(2025, 10, 31),
      time: '15:00',
      instrument: 'Guitar',
      paid: false,
      completed: false,
    ),
    MusicClass(
      id: 3,
      student: 'Carol White',
      date: DateTime(2025, 11, 1),
      time: '16:00',
      instrument: 'Violin',
      paid: true,
      completed: false,
    ),
  ];

  final List<Payment> _paymentHistory = [
    Payment(
      id: 1,
      date: DateTime(2025, 10, 1),
      amount: 50,
      status: PaymentStatus.paid,
      method: 'Credit Card',
    ),
    Payment(
      id: 2,
      date: DateTime(2025, 9, 1),
      amount: 50,
      status: PaymentStatus.paid,
      method: 'Bank Transfer',
    ),
    Payment(
      id: 3,
      date: DateTime(2025, 8, 1),
      amount: 50,
      status: PaymentStatus.paid,
      method: 'Credit Card',
    ),
  ];

  List<MusicClass> get classes => _classes;
  List<Payment> get paymentHistory => _paymentHistory;

  void addClass(MusicClass musicClass) {
    _classes.add(musicClass);
    notifyListeners();
  }

  void updateClass(MusicClass updatedClass) {
    final index = _classes.indexWhere((c) => c.id == updatedClass.id);
    if (index != -1) {
      _classes[index] = updatedClass;
      notifyListeners();
    }
  }

  void deleteClass(int id) {
    _classes.removeWhere((c) => c.id == id);
    notifyListeners();
  }

  void togglePaidStatus(int id) {
    final index = _classes.indexWhere((c) => c.id == id);
    if (index != -1) {
      _classes[index] = _classes[index].copyWith(paid: !_classes[index].paid);
      notifyListeners();
    }
  }

  void toggleCompletedStatus(int id) {
    final index = _classes.indexWhere((c) => c.id == id);
    if (index != -1) {
      _classes[index] = _classes[index].copyWith(completed: !_classes[index].completed);
      notifyListeners();
    }
  }

  List<MusicClass> getClassesByInstrument(String instrument) {
    return _classes.where((c) => c.instrument == instrument).toList();
  }

  List<MusicClass> getUpcomingClasses() {
    final now = DateTime.now();
    return _classes.where((c) => c.date.isAfter(now) && !c.completed).toList();
  }

  List<MusicClass> getCompletedClasses() {
    return _classes.where((c) => c.completed).toList();
  }

  int get nextId => _classes.isEmpty ? 1 : _classes.map((c) => c.id).reduce((a, b) => a > b ? a : b) + 1;
}
