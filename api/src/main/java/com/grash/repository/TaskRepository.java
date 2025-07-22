package com.grash.repository;

import com.grash.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByWorkOrder_Id(Long id);

    List<Task> findByPreventiveMaintenance_Id(Long id);
}
