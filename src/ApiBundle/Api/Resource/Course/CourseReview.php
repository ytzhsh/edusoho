<?php

namespace ApiBundle\Api\Resource\Course;

use ApiBundle\Api\ApiRequest;
use ApiBundle\Api\Exception\ResourceNotFoundException;
use ApiBundle\Api\Resource\Resource;

class CourseReview extends Resource
{
    public function search(ApiRequest $request, $courseId)
    {
        $course = $this->service('Course:CourseService')->getCourse($courseId);

        if (!$course) {
            throw new ResourceNotFoundException('教学计划不存在');
        }

        $conditions = array(
            'courseId' => $courseId,
            'private' => 0
        );

        $offset = $request->query->get('offset', static::DEFAULT_PAGING_OFFSET);
        $limit = $request->query->get('limit', static::DEFAULT_PAGING_LIMIT);
        $reviews = $this->service('Course:ReviewService')->searchReviews(
            $conditions,
            array('updatedTime' => 'DESC'),
            $offset,
            $limit
        );

        $this->getOCUtil()->multiple($reviews, array('userId'));
        $this->getOCUtil()->multiple($reviews, array('courseId'), 'course');

        $total = $this->service('Course:ReviewService')->searchReviewsCount($conditions);

        return $this->makePagingObject($reviews, $total, $offset, $limit);
    }
}