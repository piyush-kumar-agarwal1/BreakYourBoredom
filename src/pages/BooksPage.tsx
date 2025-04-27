import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MediaGrid from '@/components/MediaGrid';
import { booksService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIndiaMode } from '@/contexts/IndiaModeContext';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categoryBooks, setCategoryBooks] = useState({
    'bestsellers': [],
    'fiction': [],
    'thriller': [],
    'fantasy': [],
    'romance': []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bestsellers');
  const { toast } = useToast();
  const { indiaMode } = useIndiaMode();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // Main bestsellers (these will be shown in the bestsellers tab)
        const response = await booksService.getPopular(indiaMode);
        
        // Make sure we have items
        if (!response.data.items || response.data.items.length === 0) {
          throw new Error("No books found from API");
        }
        
        console.log(`Found ${response.data.items.length} popular books`);
        
        // Transform the data for bestsellers
        const transformedBooks = response.data.items
          .filter(book => book.volumeInfo && book.volumeInfo.title)
          .map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            description: book.volumeInfo.description || 'No description available',
            coverImage: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
            rating: book.volumeInfo.averageRating || 0,
            author: book.volumeInfo.authors?.join(', ') || 'Unknown author',
            publishedDate: book.volumeInfo.publishedDate,
            type: 'book',
            india: indiaMode,
            watchProviders: book.saleInfo?.buyLink ? 'Google Books Store' : 
                           (book.accessInfo?.webReaderLink ? 'Google Books Preview' : 
                           'Check local bookstores')
          }));
        
        // Save bestsellers
        setBooks(transformedBooks);
        setCategoryBooks(prev => ({ ...prev, bestsellers: transformedBooks }));
        
        // Fetch books for other categories
        const categories = ['fiction', 'thriller', 'fantasy', 'romance'];
        
        // Process each category
        const categoryResults = await Promise.all(
          categories.map(category => 
            booksService.getByCategory(category, indiaMode)  // Pass indiaMode parameter
          )
        );
        
        // Process results for each category
        const processedCategories = {};
        
        categories.forEach((category, index) => {
          const result = categoryResults[index];
          if (result.data.items && result.data.items.length > 0) {
            processedCategories[category] = result.data.items
              .filter(book => 
                book.volumeInfo && 
                book.volumeInfo.title && 
                book.volumeInfo.imageLinks && 
                book.volumeInfo.imageLinks.thumbnail
              )
              .map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                description: book.volumeInfo.description || 'No description available',
                coverImage: book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg',
                rating: book.volumeInfo.averageRating || 0,
                author: book.volumeInfo.authors?.join(', ') || 'Unknown author',
                publishedDate: book.volumeInfo.publishedDate,
                type: 'book',
                india: indiaMode
              }));
          } else {
            processedCategories[category] = [];
          }
        });
        
        // Update state with all categories
        setCategoryBooks(prev => ({ 
          ...prev, 
          ...processedCategories 
        }));
        
      } catch (error) {
        console.error('Failed to fetch books:', error);
        toast({
          title: 'Error',
          description: 'Failed to load books. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [toast, indiaMode]);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-[70vh]">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-8 pb-16">
        <div className="container">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-4">Books</h1>
            <p className="text-muted-foreground mb-6">
              {indiaMode 
                ? "Discover popular books by Indian authors and bestsellers in India."
                : "Explore bestselling books across popular genres."}
            </p>
            
            <Tabs defaultValue="bestsellers" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
                <TabsTrigger value="fiction">Fiction</TabsTrigger>
                <TabsTrigger value="thriller">Thriller</TabsTrigger>
                <TabsTrigger value="fantasy">Fantasy</TabsTrigger>
                <TabsTrigger value="romance">Romance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bestsellers">
                {categoryBooks.bestsellers && categoryBooks.bestsellers.length > 0 ? (
                  <MediaGrid items={categoryBooks.bestsellers} type="book" columns={5} />
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl">No bestsellers found</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="fiction">
                {categoryBooks.fiction && categoryBooks.fiction.length > 0 ? (
                  <MediaGrid items={categoryBooks.fiction} type="book" columns={5} />
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl">No fiction books found</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="thriller">
                {categoryBooks.thriller && categoryBooks.thriller.length > 0 ? (
                  <MediaGrid items={categoryBooks.thriller} type="book" columns={5} />
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl">No thriller books found</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="fantasy">
                {categoryBooks.fantasy && categoryBooks.fantasy.length > 0 ? (
                  <MediaGrid items={categoryBooks.fantasy} type="book" columns={5} />
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl">No fantasy books found</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="romance">
                {categoryBooks.romance && categoryBooks.romance.length > 0 ? (
                  <MediaGrid items={categoryBooks.romance} type="book" columns={5} />
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl">No romance books found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BooksPage;