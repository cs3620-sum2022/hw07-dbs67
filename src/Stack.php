<?php
/**
 * Stack.php
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
 * Dynamic Linked Stack Implementation
 *
 * @category Source
 * @package  App
 * @author   Don Stringham <donstringham@weber.edu>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://weber.edu
 */
class Stack implements StackInterface
{
    /**
     * Variable holding the stack
     *
     * @var mixed
     */
    protected $stack;

    /**
     * Stack limit variable
     *
     * @var mixed
     */
    protected $limit;

    /**
     * __construct initializes the class.
     *
     * @category Source
     * @package  App
     * @author   Don Stringham <donstringham@weber.edu>
     * @license  MIT https://opensource.org/licenses/MIT
     * @link     https://weber.edu
     */
    public function __construct($values = [], $limit = 10)
    {
        // TODO Initialize the stack.
        // TODO Add a limit to the limit variable.
    }

    /**
     * ToString returns a string representation of the class
     *
     * @category Source
     * @package  App
     * @author   Don Stringham <donstringham@weber.edu>
     * @license  MIT https://opensource.org/licenses/MIT
     * @link     https://weber.edu
     *
     * @return string
     */
    public function __toString(): string
    {
        return '/App/Stack';
    }

    /**
     * IsEmpty determines if stack is empty
     *
     * @return bool
     */
    public function isEmpty(): bool
    {
        // TODO If empty return true else false.
        return true;
    }

    /**
     * Push adds an item to the stack
     *
     * @param mixed $item to add to the stack
     *
     * @return bool
     */
    public function push($newNode): bool
    {
        // TODO Trap for stack overflow.
        // TODO Prepend item to the start of the array.
        return true;
    }

    /**
     * Removes an item from the stack
     *
     * @return mixed
     */
    public function pop()
    {
        // TODO Trap for stack overflow.
        // TODO Pop item from the start of the array.
    }

    /**
     * Returns the top of the stack
     *
     * @return mixed
     */
    public function peek()
    {
        // TODO Return the top of the stack.
    }
}
