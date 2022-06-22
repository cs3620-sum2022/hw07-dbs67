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
 * Peek Test
 *
 * @category UnitTests
 * @package  App\Tests
 * @author   Don Stringham <donstringham@weber.edu>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://weber.edu
 */
class PeekTest extends TestCase
{
    /**
     * Harness is the object under test
     *
     * @var mixed $harness
     */
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
    public function testPeekSuccess()
    {
        //arrange
        $this->harness->push(101);
        //act
        $actual = $this->harness->peek();
        //assert
        $this->assertEquals(101, $actual);
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
    public function testPeekFail()
    {
        //arrange & act
        $this->expectException(\RuntimeException::class);
        //assert
        $this->harness->peek();
    }
}
