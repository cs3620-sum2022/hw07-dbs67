<?php
/**
 * Unit-test
 *
 * PHP Version 8
 *
 * @category UnitTests
 * @package  Tests
 * @author   Don Stringham <donstringham@weber.edu>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://weber.edu
 */
declare(strict_types = 1)
;

namespace App\Tests;

use App\Stack;
use PHPUnit\Framework\TestCase;

/**
 * Push Test
 *
 * @category UnitTests
 * @package  App\Tests
 * @author   Don Stringham <donstringham@weber.edu>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://weber.edu
 */
class PushTest extends TestCase
{
    protected $harness;
    /**
     * Test
     *
     * @category UnitTests
     * @package  App\Tests
     * @author   Don Stringham <donstringham@weber.edu>
     * @license  MIT https://opensource.org/licenses/MIT
     * @link     https://weber.edu
     * @return   null
     */
    public function setUp(): void
    {
        $this->harness = new Stack();
    }

    /**
     * Test
     *
     * @category UnitTests
     * @package  App\Tests
     * @author   Don Stringham <donstringham@weber.edu>
     * @license  MIT https://opensource.org/licenses/MIT
     * @link     https://weber.edu
     * @return   null
     */
    public function testPushSuccess()
    {
        // arrange & act
        $actual = $this->harness->push(101);
        // assert
        $this->assertTrue($actual === 1);
    }

    /**
     * Test
     *
     * @category UnitTests
     * @package  App\Tests
     * @author   Don Stringham <donstringham@weber.edu>
     * @license  MIT https://opensource.org/licenses/MIT
     * @link     https://weber.edu
     * @return   null
     */
    public function testPushFail()
    {
        // arrange & act
        $this->expectException(\RuntimeException::class);
        // assert
        $this->harness->push(null);
    }

    /**
     * Test
     *
     * @category UnitTests
     * @package  App\Tests
     * @author   Don Stringham <donstringham@weber.edu>
     * @license  MIT https://opensource.org/licenses/MIT
     * @link     https://weber.edu
     * @return   null
     */
    public function testPushFailStackOverflow()
    {
        // arrange & act
        $this->expectException(\RuntimeException::class);
        for ($i = 0; $i < $this->harness->getLimit(); $i++) {
            $this->harness->push($i + 1);
        }
        // assert
        $this->harness->push(666);
    }
}
