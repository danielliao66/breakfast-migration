namespace BreakfastServer.Services;

public class NumGenerator
{
    private int _currentNum = 0;

    public int GetNext()
    {
        return Interlocked.Increment(ref _currentNum);
    }
}