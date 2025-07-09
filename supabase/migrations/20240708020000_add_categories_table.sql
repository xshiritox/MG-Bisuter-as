    -- Create categories table
    CREATE TABLE IF NOT EXISTS public.categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Enable Row Level Security
    ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

    -- Create policy to allow public read access
    CREATE POLICY "Enable read access for all users" 
    ON public.categories 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);

    -- Create policy to allow insert for authenticated users
    CREATE POLICY "Enable insert for authenticated users only" 
    ON public.categories 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

    -- Create policy to allow update for authenticated users
    CREATE POLICY "Enable update for authenticated users only" 
    ON public.categories 
    FOR UPDATE 
    TO authenticated 
    USING (true);

    -- Create policy to allow delete for authenticated users
    CREATE POLICY "Enable delete for authenticated users only" 
    ON public.categories 
    FOR DELETE 
    TO authenticated 
    USING (true);

    -- Insert default categories if they don't exist
    INSERT INTO public.categories (name)
    SELECT unnest(ARRAY[
    'Collares',
    'Pulseras',
    'Cadenas para espejuelos',
    'Adornos para estetoscopios',
    'Colgantes',
    'Llaveros'
    ])
    WHERE NOT EXISTS (SELECT 1 FROM public.categories);

    -- La creación de la tabla y la inserción de categorías se manejan en las sentencias SQL anteriores
