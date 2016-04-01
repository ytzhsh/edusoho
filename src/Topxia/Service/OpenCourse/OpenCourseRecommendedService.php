<?php
namespace Topxia\Service\OpenCourse;

interface OpenCourseRecommendedService
{
    public function addRecommendedCoursesToOpenCourse($openCourseId, $recommendCourseIds, $origin);

    public function findRecommendedCoursesByOpenCourseId($openCourseId);

    public function findRecommendCourse($classroomId, $courseId);

    public function updateOpenCourseRecommendedCourses($openCourseId, $activeCourseIds);
}
