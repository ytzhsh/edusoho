<?php
namespace Topxia\Service\Order\OrderType;

use Topxia\Service\Order\OrderType\OrderType;

class OrderTypeFactory
{
    public static function create($target)
    {
        if (empty($target)) {
            throw new Exception("订单类型不存在");
        }

        $class = __NAMESPACE__.'\\'.ucfirst($target).'OrderType';

        return new $class();
    }
}
