
package com.example.TaskManagerApplication.repository;

import com.example.TaskManagerApplication.entity.Priority;
import com.example.TaskManagerApplication.entity.Task;
import com.example.TaskManagerApplication.entity.TaskStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends
        JpaRepository<Task, Long>,
        JpaSpecificationExecutor<Task> {

    List<Task> findByTitleContainingIgnoreCaseAndUserId(
            String title,
            Long userId
    );

    Page<Task> findByStatusAndUserId(
            TaskStatus status,
            Long userId,
            Pageable pageable
    );

    Page<Task> findByPriorityAndUserId(
            Priority priority,
            Long userId,
            Pageable pageable
    );

    Page<Task> findByStatusAndPriorityAndUserId(
            TaskStatus status,
            Priority priority,
            Long userId,
            Pageable pageable
    );

    Page<Task> findByUserId(Long userId, Pageable pageable);

    Optional<Task> findByIdAndUserId(Long id, Long userId);
}
