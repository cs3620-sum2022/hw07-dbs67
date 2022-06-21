<?php
/**
 * StackInterface.php
 *
 * PHP Version 8
 *
 * @category Source
 * @package  App
 * @author   Don Stringham <donstringham@weber.edu>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://weber.edu
 */
declare(strict_types=1);
namespace App;

/**
 * StackInterface data type
 *
 * @category Source
 * @package  App
 * @author   Don Stringham <donstringham@weber.edu>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://weber.edu
 */
interface StackInterface
{
    /**
     * IsEmpty determines if stack is empty
     *
     * @return bool
     */
    public function isEmpty(): bool;

    /**
     * Push adds an item to the stack
     *
     * @param mixed $item to add to the stack
     *
     * @return bool
     */
    public function push($item);

    /**
     * Removes an item from the stack
     *
     * @return bool
     */
    public function pop();

    /**
     * Returns the top of the stack
     *
     * @return $item
     */
    public function peek();
}
