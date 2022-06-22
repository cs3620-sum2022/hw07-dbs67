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
declare(strict_types = 1)
;
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
        // Initialize the stack.
        $this->stack = [];
        // Add a limit to the limit variable.
        $this->limit = $limit;
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
        // If empty return true else false.
        return empty($this->stack);
    }

    /**
     * getLimit returns the limit
     *
     * @return int
     */
    public function getLimit(): int
    {
        return $this->limit;
    }
    /**
     * Push adds an item to the stack
     *
     * @param mixed $item to add to the stack
     *
     * @throws \RuntimeException
     *
     *  @return int
     */
    public function push($newNode): int
    {
        // Trap for stack overflow.
        if (count($this->stack) >= $this->limit) {
            throw new \RuntimeException('Stack overflow');
        }
        if ($newNode === null) {
            throw new \RuntimeException('Node is null');
        }
        // Prepend item to the start of the array.
        return array_unshift($this->stack, $newNode);
    }

    /**
     * Removes an item from the stack
     *
     * @throws \RuntimeException stack overflow
     *
     * @return mixed
     */
    public function pop()
    {
        // Trap for stack overflow.
        if ($this->isEmpty()) {
            throw new \RuntimeException('Stack is empty');
        }
        // Pop item from the start of the array.
        return array_shift($this->stack);
    }

    /**
     * Looks at the top of the stack
     *
     * @return mixed
     */
    public function peek()
    {
        // Return the top of the stack.
        if ($this->isEmpty()) {
            throw new \RuntimeException('Stack is empty');
        }
        // Peek item from the start of the array.
        return current($this->stack);
    }
}
