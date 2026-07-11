using System.Threading;

namespace BreakfastServer.Services;

public class NumGenerator : INumGenerator
{
    private int _currentNum = 0;

    public int GetNext()
    {
        return Interlocked.Increment(ref _currentNum);
    }
}